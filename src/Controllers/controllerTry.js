const modeltry=require("../models/modelTry")
const multer = require('multer');

const getClientes= async(request,response)=>{

    const data= await modeltry.getClientes()
    return response.status(200).json(data)

}

const getAllEx= async(request,response)=>{

    const data= await modeltry.getAllEx()
    return response.status(200).json(data)

}

const getPageComparar= async(request,response)=>{

    const data= await modeltry.getPageComparar(request.param("id"))
    return response.status(200).json(data)

}

const getPlanosInfo= async(request,response)=>{

    const data= await modeltry.getPlanosInfo()
    return response.status(200).json(data)

}

const getPlanosExercicios= async(request,response)=>{

    const data= await modeltry.getPlanosExercicios()
    return response.status(200).json(data)

}

const getAvl= async(request,response)=>{

    const data= await modeltry.getAvl(request.param("id"))
    return response.status(200).json(data)

}

const addVideo= async(request,response)=>{

    const data= await modeltry.addVideo()
    return response.status(200).json(data)

}

const getExercicios= async(request,response)=>{

    const data= await modeltry.getExercicios(request.param("ids"))
    return response.status(200).json(data)

}


const getClientesColaboradores= async(request,response)=>{

    const data= await modeltry.getClientesColaboradores()
    return response.status(200).json(data)

}

const getAtividade= async(request,response)=>{

    const data= await modeltry.getAtividade()
    return response.status(200).json(data)

}

const getPtData= async(request,response)=>{

    const data= await modeltry.getPtData()
    return response.status(200).json(data)

}

const getEstatisticas= async(request,response)=>{

    const data= await modeltry.getEstatisticas()
    return response.status(200).json(data)

}

const deleteColaboradores= async(request,response)=>{

    const result= await modeltry.deleteColaboradores(request.param("Id"),request.param("responsavel"),request.param("nivel"))
    return response.status(201).json(result)

}

const deleteAvaliacoes= async(request,response)=>{

    const result= await modeltry.deleteAvaliacoes(request.param("Id"),request.param("responsavel"),request.param("nivel"),request.param("tipo"))
    return response.status(201).json(result)

}

const deletePlanos= async(request,response)=>{

    const result= await modeltry.deletePlanos(request.param("Id"),request.param("responsavel"),request.param("nivel"))
    return response.status(201).json(result)

}

const deletePlanosInfo= async(request,response)=>{

    const result= await modeltry.deletePlanosInfo(request.param("Id"),request.param("responsavel"),request.param("nivel"))
    return response.status(201).json(result)

}

const deleteEvent= async(request,response)=>{

    const data= await modeltry.deleteEvent(request.param("Id"),request.param("responsavel"),request.param("nivel"))
    return response.status(200).json(data)

}

const deleteClients= async(request,response)=>{

    const data= await modeltry.deleteClients(request.param("Id"),request.param("responsavel"),request.param("nivel"))
    return response.status(200).json(data)

}

const deleteExercicios= async(request,response)=>{

    const data= await modeltry.deleteExercicios(request.param("Id"),request.param("responsavel"),request.param("nivel"))
    return response.status(200).json(data)

}

const getEventos= async(request,response)=>{

    const data= await modeltry.getEventos()
    return response.status(200).json(data)

}

const getEventosOfWeek= async(request,response)=>{

    const data= await modeltry.getEventosOfWeek()
    return response.status(200).json(data)

}

const getColaboradores= async(request,response)=>{

    const data= await modeltry.getColaboradores()
    return response.status(200).json(data)

}

const getPtInfo= async(request,response)=>{

    const data= await modeltry.getPtInfo()
    return response.status(200).json(data)

}

const getAulasGrupo= async(request,response)=>{

    const data= await modeltry.getAulasGrupo(request.param("Dia"))
    return response.status(200).json(data)

}

const TesteForcaCliente= async(request,response)=>{

    console.log(request.params)
    const data= await modeltry.TesteForcaCliente(request.param("Id"))
    return response.status(200).json(data)

}

const MedidasCliente= async(request,response)=>{

    console.log(request.params)
    const data= await modeltry.MedidasCliente(request.param("Id"))
    return response.status(200).json(data)

}

const getPlanosTreino= async(request,response)=>{

    console.log(request.params)
    const data= await modeltry.getPlanosTreino(request.param("Id"))
    return response.status(200).json(data)

}

const updateClientes= async (request,response)=>{
    
    const result = await modeltry.updateClientes(request.body)
    return response.status(201).json(result)

}

const activatePlanoSemanal= async (request,response)=>{
    
    const result = await modeltry.activatePlanoSemanal(request.body)
    return response.status(201).json(result)

}


const alterarSenha= async (request,response)=>{
    
    const result = await modeltry.alterarSenha(request.body)
    return response.status(201).json(result)

}

const updateEvents= async (request,response)=>{
    
    const result = await modeltry.updateEvents(request.body)
    return response.status(201).json(result)

}

const changePlanoDia= async(request,response)=>{

    const data= await modeltry.changePlanoDia(request.body)
    return response.status(200).json(data)

}

const updateClientesApp= async (request,response)=>{
    
    const result = await modeltry.updateClientesApp(request.body)
    return response.status(201).json(result)

}

const updateColaboradores= async (request,response)=>{
    
    const result = await modeltry.updateColaboradores(request.body)
    return response.status(201).json(result)

}

const updatePlanoInfo= async (request,response)=>{
    
    const result = await modeltry.updatePlanoInfo(request.body)
    return response.status(201).json(result)

}

const updateExercicio= async (request,response)=>{
    
    const result = await modeltry.updateExercicio(request.body)
    return response.status(201).json(result)

}

const addExercicio= async (request,response)=>{
    
    const result = await modeltry.addExercicio(request.body)
    return response.status(201).json(result)

}

const addMedidas = async (request, response) => {
    try {
      const result = await modeltry.addMedidas(request.body);
      return response.status(201).json(result);
    } catch (error) {
      console.error('Error adding medidas:', error);
      return response.status(400).json({ error: 'Já existe uma avaliação nessa data' });
    }
  };
  


const addFisico= async (request,response)=>{
    try {
        const result = await modeltry.addFisico(request.body);
        return response.status(201).json(result);
      } catch (error) {
        const errorMessage = "Já existe uma avaliação nessa data";
        // Handle any errors that may occur during the request
        console.error('Error uploading data:', error);
        return response.status(400).json(errorMessage);
      }

}


const addPlanoTreinoInfo= async (request,response)=>{
    
    const result = await modeltry.addPlanoTreinoInfo(request.body)
    return response.status(201).json(result)

}

const addPlanoTreino= async (request,response)=>{
    
    const result = await modeltry.addPlanoTreino(request.body)
    return response.status(201).json(result)

}

const addColaboradores= async (request,response)=>{
    
    const result = await modeltry.addColaboradores(request.body)
    return response.status(201).json(result)

}


const recuperar= async (request,response)=>{
    
    const result = await modeltry.recuperar(request.body)
    return response.status(201).json(result)

}

const addPts= async (request,response)=>{
    
    const result = await modeltry.addPts(request.body)
    return response.status(201).json(result)

}


  
  const uploadImages = async (request, response) => {

  };

  


const sendEmail= async (request,response)=>{
    
    const result = await modeltry.sendEmail(request.body)
    return response.status(201).json(result)

}

const createEvent= async (request,response)=>{
    
    const result = await modeltry.createEvent(request.body)
    return response.status(201).json(result)

}

const createData= async (request,response)=>{

    var repetido=false
    const data= await modeltry.getClientes()
    var codigoCliente=Math.floor(Math.random() * 100000) + 10000;
    var senha=Math.floor(Math.random() * 100000000) + 1000000;
   
    var flag=false
    while (!flag){
    data.forEach(element => {

        if(element.codigoCliente==codigoCliente){
            repetido=true
        }
        
    })
    if(!repetido){
        flag=true
    }
    else{
        codigoCliente=Math.floor(Math.random() * 100000000) + 10000000;
    }
    }
    codigoCliente="c"+codigoCliente
    console.log(codigoCliente)
 
        const result = await modeltry.create(request.body,codigoCliente,senha)
        return response.status(201).json(result)
    
}

module.exports={
    getClientes,
    getColaboradores,
    createData,
    getAulasGrupo,
    getPlanosTreino,
    updateClientes,
    MedidasCliente,
    TesteForcaCliente, 
    getPtInfo,
    deleteColaboradores,
    addColaboradores,
    deleteClients,
    sendEmail,
    updateColaboradores,
    uploadImages,
    getEventos,
    createEvent,
    deleteEvent,
    addPts,
    getEstatisticas,
    getPtData,
    getAtividade,
    getClientesColaboradores,
    getEventosOfWeek,
    updateClientesApp,
    addVideo,
    getExercicios,
    getAvl,
    getPlanosExercicios,
    getPlanosInfo,
    changePlanoDia,
    deletePlanos,
    deletePlanosInfo,
    getAllEx,
    updatePlanoInfo,
    deleteExercicios,
    updateExercicio,
    addExercicio,
    addPlanoTreinoInfo,
    addPlanoTreino,
    updateEvents,
    deleteAvaliacoes,
    activatePlanoSemanal,
    addFisico,
    addMedidas,
    getPageComparar,
    recuperar,
    alterarSenha
}