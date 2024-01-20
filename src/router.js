const express=require("express")
const controllerTry=require("./Controllers/controllerTry")
const connection=require("./models/connection")

const router=express.Router()


router.get("/GetAllExercicios", controllerTry.getAllEx)
router.get("/GetPlanosInfo", controllerTry.getPlanosInfo)
router.get("/GetPlanosExercicios", controllerTry.getPlanosExercicios)
router.get("/GetAvaliacoes", controllerTry.getAvl)
router.get("/Clientes", controllerTry.getClientes)
router.get("/ClientesColaboradores", controllerTry.getClientesColaboradores)
router.get("/Colaboradores", controllerTry.getColaboradores)
router.get("/AulasGrupo", controllerTry.getAulasGrupo)
router.get("/PlanosTreino", controllerTry.getPlanosTreino)
router.get("/PtInfo", controllerTry.getPtInfo)
router.get("/MedidasCliente", controllerTry.MedidasCliente)
router.get("/TesteForcaCliente", controllerTry.TesteForcaCliente)
router.get("/Eventos", controllerTry.getEventos)
router.get("/Estatisticas", controllerTry.getEstatisticas)
router.get("/PtData", controllerTry.getPtData)
router.get("/Atividade", controllerTry.getAtividade)
router.get("/EventosOfWeek", controllerTry.getEventosOfWeek)
router.get("/PageComparar", controllerTry.getPageComparar)

router.delete("/ApagarColaboradores", controllerTry.deleteColaboradores)
router.delete("/ApagarAvaliacoes", controllerTry.deleteAvaliacoes)
router.delete("/ApagarPlano", controllerTry.deletePlanos)
router.delete("/ApagarPlanoInfo", controllerTry.deletePlanosInfo)
router.delete("/ApagarEvents", controllerTry.deleteEvent)
router.delete("/ApagarClients", controllerTry.deleteClients)
router.delete("/ApagarExercicios", controllerTry.deleteExercicios)

router.post("/ChangePlanoDia", controllerTry.changePlanoDia)
router.post("/AddPts", controllerTry.addPts)
router.post("/AddFisico", controllerTry.addFisico)
router.post("/AddMedidas", controllerTry.addMedidas)
router.post("/UploadImages", controllerTry.uploadImages)
router.post("/AddColaboradores", controllerTry.addColaboradores)
router.post("/UpdateColaboradores", controllerTry.updateColaboradores)
router.post("/UpdateEvents", controllerTry.updateEvents)
router.post("/Recuperar", controllerTry.recuperar)
router.post("/AlterarSenha", controllerTry.alterarSenha)
router.post("/UpdatePlanoInfo", controllerTry.updatePlanoInfo)
router.post("/UpdateExercicio", controllerTry.updateExercicio)
router.post("/AddExercicio", controllerTry.addExercicio)
router.post("/AddPlanoTreinoInfo", controllerTry.addPlanoTreinoInfo)
router.post("/AddPlanoTreino", controllerTry.addPlanoTreino)
router.post("/ActivatePlanoSemanal", controllerTry.activatePlanoSemanal)

router.post("/AddClients", controllerTry.createData)
router.post("/AddEvents", controllerTry.createEvent)
router.post("/SendEmail", controllerTry.sendEmail)
router.post("/UpdateClientes", controllerTry.updateClientes)
router.post("/UpdateClientesApp", controllerTry.updateClientesApp)

router.post("/AddVideo", controllerTry.addVideo)
router.get("/GetExercicios", controllerTry.getExercicios)



const multer = require('multer');
const fs = require('fs');
const path = require('path');



// Set up multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination folder for storing the uploaded image
    cb(null, './images/');
  },
  filename: function (req, file, cb) {
    // Define the filename for the uploaded image
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create a multer instance
const upload = multer({ storage });

// Define the image upload route
router.post('/upload', upload.single('image'), (req, res) => {
    // Handle the uploaded image and generate a URL
    const imageUrl = req.protocol + '://' + req.get('host') + '/' + path.join('images', req.file.filename).replace(/\\/g, '/');
    // Modify imageUrl as needed, such as appending your domain or converting it to a URL
    
    // Send the URL back as a response    
    res.json({ imageUrl });
});


const pdfParse = require("pdf-parse");

router.post('/PdfData', upload.single('pdfFile'), (req, res) => {
  if (!req.file) {
    res.status(400).send('No PDF file uploaded.');
    return;
  }

  const Id = req.body.id; // Assuming Id is the name of the field in the form data
  const Avlm = req.body.tipo;
  const Responsavel = req.body.responsavel;
  const NivelResponsavel = req.body.nivelResponsavel;
  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

  pdfParse(req.file.path).then(async (result) => {
    const pdfData = result.text; // Assuming result.text contains the PDF data
    console.log(pdfData);
    const lines = pdfData.split('\n'); // Split the text into an array of lines

    const query = {}; // Object to store the query data

    lines.forEach((line) => {
      const parts = line.split(':'); // Split each line into key-value pairs using ':'
      if (parts.length === 2) {
        const key = parts[0].trim(); // Trim whitespace from the left and right of the key
        const value = parts[1].trim(); // Trim whitespace from the left and right of the value

        // Skip the keys "NomeCliente" and "nome"
        if (key !== 'NomeCliente' && key !== 'nome') {
          query[key] = value; // Assign the key-value pair to the query object
        }
      }
    });

    // Assuming you have a database connection named 'connection'
    const queryKeys = Object.keys(query).join(', ');
    const queryValues = Object.values(query).map(value => `'${value}'`).join(', ');

    let sqlQuery; // Declare sqlQuery variable outside the if statement

    if (Avlm == "false") {
      // Check if a row with the same DataAvaliacao already exists
      const checkQuery = `SELECT * FROM MedidasCliente WHERE DataAvaliacao = '${query['DataAvaliacao']}' AND IdClienteInfo=${Id}`;
      const [existingRow] = await connection.execute(checkQuery);
      
      if (existingRow.length > 0) {
        // Row already exists, do something (e.g., update existing row or return an error)
        res.status(400).send('A row with the same DataAvaliacao already exists.');
        return;
      }

      // Insert a new row
      sqlQuery = `INSERT INTO MedidasCliente (${queryKeys}, IdClienteInfo) VALUES (${queryValues}, ${Id})`;
    } else {
      const checkQuery = `SELECT * FROM TesteForcaCliente WHERE DataAvaliacao = '${query['DataAvaliacao']}' AND IdClienteInfo=${Id}`;
      const [existingRow] = await connection.execute(checkQuery);
      
      if (existingRow.length > 0) {
        // Row already exists, do something (e.g., update existing row or return an error)
        res.status(400).send('A row with the same DataAvaliacao already exists.');
        return;
      }

      sqlQuery = `INSERT INTO TesteForcaCliente (${queryKeys}, IdClienteInfo) VALUES (${queryValues}, ${Id})`;
    }

    try {
      const [data1] = await connection.execute(sqlQuery);
      const [data2] = await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Avaliação adicionada', '"+Responsavel+"', '"+date+"', '"+NivelResponsavel+"', 0)");
      console.log(data1);
      res.status(200).send('Data inserted successfully.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error inserting data.');
    }
  });
});












module.exports=router