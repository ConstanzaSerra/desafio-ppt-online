import { firestore, rtdb } from "./db.ts";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import { log } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const userCollection = firestore.collection("users-ppt");
const roomCollection = firestore.collection("rooms");

app.use(express.static("dist"));

app.get("/healthcheck", (req: Request, res: Response) => {
  res.status(200).json({ message: "Conexión realizada!" });
});

app.post("/signup", (req: Request, res: Response) => {
  const nombre = req.body.nombre;
  userCollection
    .where("nombre", "==", nombre)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCollection
          .add({
            nombre, //abreviatura de nombre: nombre
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
              new: true,
            });
          });
      } else {
        res.status(400).json({
          message: "user alredy exists",
        });
      }
    });
});

app.post("/auth", (req: Request, res: Response) => {
  //equivalente a const nombre = req.body.nombre
  const { nombre } = req.body;
  userCollection
    .where("nombre", "==", nombre)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});

app.post("/rooms", (req: Request, res: Response) => {
  const { userId } = req.body;
  console.log("userId recibido en backend:", userId);

  userCollection
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const name = doc.data();
        console.log(
          "el usuario existe y se llama, se tendria que crear a continuacion la room",
        );

        const roomLongId = nanoid();

        const initialRoomData = {
          rtdbRoomId: roomLongId,
          currentGame: {
            [userId]: {
              choice: null,
              name: name.nombre,
              online: true,
              start: false,
              totalGanados: 0,
            },
          },
          timer: 3,
          messages: [],
        };

        const roomId = 1000 + Math.floor(Math.random() * 999);

        return rtdb
          .ref(`rooms/${roomId}`)
          .set(initialRoomData)
          .then(() => {
            res.json({ roomId });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Error creando la room", error });
          });
      } else {
        // Cerrás el else acá
        res.status(401).json({
          message: "no existis",
        });
      }
    }) // Cerrás el then acá
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error obteniendo usuario", error });
    });
});

app.post("/rooms/:roomId/user", (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.body;

  console.log(req.body);

  // Verificar que userId y roomId sean válidos
  if (typeof userId !== "string") {
    return res
      .status(400)
      .json({ message: "userId es requerido y debe ser un string." });
  }

  if (typeof roomId !== "string") {
    return res
      .status(400)
      .json({ message: "roomId es requerido y debe ser un string." });
  }

  userCollection
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //el usuario existe, ahora tengo que buscar en la rtdb si la room existe

        //ya que estoy obtengo el nombre del usuario
        const user = doc.data();
        //ahora si busco la room en la rtdb
        const roomRef = rtdb.ref(`rooms/${roomId}`);

        return roomRef.get().then((roomSnap) => {
          if (!roomSnap.exists()) {
            return res.status(404).json({ message: "Room no encontrada" });
          }

          const roomData = roomSnap.val();
          const currentGame = roomData.currentGame || {};
          const playersCount = Object.keys(currentGame).length;

          if (playersCount >= 2) {
            return res
              .status(400)
              .json({ message: "Máximo de jugadores alcanzado" });
          }

          currentGame[userId] = {
            choice: null,
            name: user?.nombre || "Jugador",
            online: true,
            start: false,
            totalGanados: 0,
          };

          return roomRef
            .update({ currentGame })
            .then(() => {
              res
                .status(200)
                .json({ message: "Jugador agregado", currentGame });
            })
            .catch((error) => {
              console.error(error);
              res
                .status(500)
                .json({ message: "Error agregando jugador", error });
            });
        });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

app.get("/rooms/:roomId", (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.query;

  // Verificar que userId y roomId sean válidos
  if (typeof userId !== "string") {
    return res
      .status(400)
      .json({ message: "userId es requerido y debe ser un string." });
  }

  if (typeof roomId !== "string") {
    return res
      .status(400)
      .json({ message: "roomId es requerido y debe ser un string." });
  }

  userCollection
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        // Obtener la información de la room desde RTDB
        const roomRef = rtdb.ref(`rooms/${roomId}`);

        roomRef
          .get()
          .then((snap) => {
            if (!snap.exists()) {
              // Si la room no existe, se devuelve 404
              return res.status(404).json({
                message: "Room no encontrada",
              });
            }

            const data = snap.val(); // Obtener los datos de la room
            res.json(data); // Enviar los datos como respuesta
          })
          .catch((error) => {
            console.error(error);
            res
              .status(500)
              .json({ message: "Error obteniendo la room", error });
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error obteniendo usuario", error });
    });
});

app.patch("/rooms/:roomId/player", (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.body;

  // Verificar que userId y roomId sean válidos
  if (typeof userId !== "string") {
    return res
      .status(400)
      .json({ message: "userId es requerido y debe ser un string." });
  }

  if (typeof roomId !== "string") {
    return res
      .status(400)
      .json({ message: "roomId es requerido y debe ser un string." });
  }

  //Verificar qué datos se van a actualizar
  const changes: any = {};
  if (req.body.start !== undefined) changes.start = req.body.start;
  if (req.body.choice !== undefined) changes.choice = req.body.choice;
  if (req.body.totalGanados !== undefined)
    changes.totalGanados = req.body.totalGanados;

  const playerRef = rtdb.ref(`rooms/${roomId}/currentGame/${userId}`);

  playerRef
    .get()
    .then((snap) => {
      if (!snap.exists()) {
        return res
          .status(404)
          .json({ message: "Room o jugador no encontrado" });
      }

      return playerRef.update(changes).then(() => {
        res.status(200).json({ message: "Jugador actualizado", changes });
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error actualizando jugador", error });
    });
});

app.get("/env", (req: Request, res: Response) => {
  res.json({ environment: process.env.NODE_ENV });
});

app.get("/*", (req: Request, res: Response) => {
  // dist está en la raíz del proyecto, no dentro de /server
  res.sendFile(path.resolve(process.cwd(), "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor iniciado en puerto: ${port}`);
});
