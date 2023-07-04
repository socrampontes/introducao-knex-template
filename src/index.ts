import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.get("/getAllBands", async (req: Request, res: Response) =>{
try {
    const result = await db.raw(`
    SELECT * FROM bands
    `);
    res.status(200).send(result);
} catch (error) {
    res.status(400).send(error)
}
});

app.post("/addBand", async (req: Request, res:Response) =>{
    try {
        const id = req.body.id;
        const name = req.body.name;
       
        if(!id || !name) {
            res.statusCode = 404;
            throw new Error("Dados inválidos")
        }
       
        await db.raw(`
        INSERT INTO bands(id, name)
        VALUES("${id}", "${name}");
        `)

        res.status(200).send('banda cadastrasda com sucesso')
    } catch (error) {
        res.status(400).send(error)
    }
})

app.put("/update/:id", async (req: Request, res:Response) =>{
    try {
        const bandId = req.params.id;
        const name = req.body.name;
await db.raw(`
UPDATE bands
SET name = "${name}" 
WHERE id =  "${bandId}"
`)
res.status(200).send("banda atualizada com sucesso")
    } catch (error) {
        res.status(405).send(error)
    }
});

//FIXAÇÂO

app.get("/getAllSongs", async (req: Request, res: Response) =>{
try {
    const result = await db.raw(`
    SELECT * FROM songs
    `);
    res.status(200).send(result);
} catch (error) {
    res.status(400).send(error)
}
});

app.post("/addSong", async (req: Request, res:Response) =>{
    try {
        const id = req.body.id;
        const name = req.body.name;
        const bandId = req.body.band_id;
       
        if(!id || !name || !bandId) {
            res.statusCode = 404;
            throw new Error("Dados inválidos")
        }
       
        await db.raw(`
        INSERT INTO songs(id, name, band_id)
        VALUES("${id}", "${name}", "${bandId}");
        `)

        res.status(200).send('musica cadastrasda com sucesso')
    } catch (error) {
        res.status(400).send(error)
    }
})

app.put("/updateSongs/:id", async (req: Request, res:Response) =>{
    try {
        const SongId = req.params.id;
        const name = req.body.name;
        if (name == undefined) {
            res.statusCode = 500
            throw new Error("entrada invalida")
        }
await db.raw(`
UPDATE songs
SET name = "${name}" 
WHERE id =  "${SongId}"
`)
res.status(200).send("musica atualizada com sucesso")
    } catch (error) {
        res.status(405).send(error)
    }
})