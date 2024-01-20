const connection=require("./connection")
const nodemailer = require('nodemailer');
const {email, password } = require('./emailInfo');
const fs = require('fs');


const addVideo= async() =>{

  const videoData = fs.readFileSync('./images/video.mp4');

  const query = "INSERT INTO testevideo (video) VALUES (?)";
  const values = [videoData];

  const [data] = await connection.execute(query, values);
  return data;
}


const getPlanosInfo = async () => {
  const query = `SELECT * from planotreinoinfo`;

  const [data] = await connection.execute(query);

  await Promise.all(
    data.map(async (element) => {
      const array = element.ListaExercicios.split(";");
      const repsArray = element.ListaRepeticoesExercicio.split(";");
      const exercisePromises = array.map(async (ele, index) => {
        const [exerciseData] = await connection.execute(
          "SELECT * from exercicios where id = ?",
          [ele]
        );

        if (exerciseData[0]) {
          exerciseData[0].reps =
            typeof repsArray[index] !== "undefined" ? repsArray[index] : "";
          console.log(exerciseData);
          return exerciseData;
        } else {
          return null; // or handle the case when exerciseData[0] is undefined
        }
      });
      const resolvedExercisePromises = await Promise.all(exercisePromises);
      element.exercises = resolvedExercisePromises;
    })
  );

  return data;
};



const getPlanosExercicios= async() =>{

  const query = `SELECT p.*, 
  sinfo.NomePlanoTreino as SegundaInfo, 
  sinfo.ListaExercicios as SegundaInfoExercicios,
  sinfo.ListaRepeticoesExercicio as SegundaInfoRepeticoes,
  tinfo.NomePlanoTreino as TerçaInfo, 
  tinfo.ListaExercicios as TercaInfoExercicios,
  tinfo.ListaRepeticoesExercicio as TercaInfoRepeticoes,
  qinfo.NomePlanoTreino as QuartaInfo,
  qinfo.ListaExercicios as QuartaInfoExercicios,
  qinfo.ListaRepeticoesExercicio as QuartaInfoRepeticoes,
  quinfo.NomePlanoTreino as QuintaInfo,
  quinfo.ListaExercicios as QuintaInfoExercicios,
  quinfo.ListaRepeticoesExercicio as QuintaInfoRepeticoes,
  sexinfo.NomePlanoTreino as SextaInfo,
  sexinfo.ListaExercicios as SextaInfoExercicios,
  sexinfo.ListaRepeticoesExercicio as SextaInfoRepeticoes,
  sabinfo.NomePlanoTreino as SabadoInfo,
  sabinfo.ListaExercicios as SabadoInfoExercicios,
  sabinfo.ListaRepeticoesExercicio as SabadoInfoRepeticoes
FROM planotreinocliente p
LEFT JOIN planotreinoinfo sinfo ON sinfo.idPlanoTreinoInfo = p.IdPlanoInfoSegunda
LEFT JOIN planotreinoinfo tinfo ON tinfo.idPlanoTreinoInfo = p.IdPlanoInfoTerca
LEFT JOIN planotreinoinfo qinfo ON qinfo.idPlanoTreinoInfo = p.IdPlanoInfoQuarta
LEFT JOIN planotreinoinfo quinfo ON quinfo.idPlanoTreinoInfo = p.IdPlanoInfoQuinta
LEFT JOIN planotreinoinfo sexinfo ON sexinfo.idPlanoTreinoInfo = p.IdPlanoInfoSexta
LEFT JOIN planotreinoinfo sabinfo ON sabinfo.idPlanoTreinoInfo = p.IdPlanoInfoSabado ORDER BY p.ativo
`;



  const [data] = await connection.execute(query);
  return data;
}

const getExercicios= async(data)=>{

  const Ids = data.split(";")
  console.log(Ids)
  const results = [];

  for (const element of Ids) {
    console.log(element)
    const [row] = await connection.execute("SELECT * FROM exercicios WHERE id = ?", [element]);
    results.push(row);
  }

  return results;

}


const getAllEx= async()=>{


    const [results] = await connection.execute("SELECT * FROM exercicios ORDER BY ativo");

  return results;

}


const getPageComparar= async(data)=>{
  console.log(data)
  const Id = data;

  const medidasQuery = `
  SELECT MedidasCliente.*, clienteinfo.NomeCliente, colaboradores.nome
  FROM MedidasCliente
  LEFT JOIN clienteinfo ON MedidasCliente.IdClienteInfo = clienteinfo.IdClienteInfo
  LEFT JOIN colaboradores ON MedidasCliente.IdPtInfo = colaboradores.idColaboradores
  WHERE MedidasCliente.IdClienteInfo = ${Id};
`;         

const testeForcaQuery = `
  SELECT TesteForcaCliente.*, clienteinfo.NomeCliente, colaboradores.nome, DataAvaliacao AS DataAvaliacaoForca
  FROM TesteForcaCliente
  LEFT JOIN clienteinfo ON TesteForcaCliente.IdClienteInfo = clienteinfo.IdClienteInfo
  LEFT JOIN colaboradores ON TesteForcaCliente.IdPtInfo = colaboradores.idColaboradores
  WHERE TesteForcaCliente.IdClienteInfo = ${Id};
`;



  const [medidasResults] = await connection.execute(medidasQuery);
  const [testeForcaResults] = await connection.execute(testeForcaQuery);

  const avlData = {
    medidas: medidasResults,
    testeForca: testeForcaResults,

  };





  return avlData;

  

}


const getAvl= async(data)=>{
  console.log(data)
  const Id = data;

  const medidasQuery = `
  SELECT MedidasCliente.*, clienteinfo.NomeCliente, colaboradores.nome
  FROM MedidasCliente
  LEFT JOIN clienteinfo ON MedidasCliente.IdClienteInfo = clienteinfo.IdClienteInfo
  LEFT JOIN colaboradores ON MedidasCliente.IdPtInfo = colaboradores.idColaboradores
  WHERE MedidasCliente.IdClienteInfo = ${Id};
`;         

const testeForcaQuery = `
  SELECT TesteForcaCliente.*, clienteinfo.NomeCliente, colaboradores.nome, DataAvaliacao AS DataAvaliacaoForca
  FROM TesteForcaCliente
  LEFT JOIN clienteinfo ON TesteForcaCliente.IdClienteInfo = clienteinfo.IdClienteInfo
  LEFT JOIN colaboradores ON TesteForcaCliente.IdPtInfo = colaboradores.idColaboradores
  WHERE TesteForcaCliente.IdClienteInfo = ${Id};
`;


  const [medidasResults] = await connection.execute(medidasQuery);
  const [testeForcaResults] = await connection.execute(testeForcaQuery);

  const avlData = {
    medidas: medidasResults,
    testeForca: testeForcaResults,
  };

  return avlData;

  

}


const getClientes= async() =>{

   /* const [data]= await connection.execute("select * from clienteinfo c, plano p WHERE pt.IdPtInfo=c.idPtInfo")*/

   const query = `SELECT cl.*, c.telefone, c.idColaboradores, c.nome, c.email, c.perfil, c.capa, c.DataNasc, c.insta, c.descr, ptc.nomeGrupoPlanos, ptc.IdPlanoTreinoCliente, 
   sinfo.NomePlanoTreino as SegundaInfo, 
   tinfo.NomePlanoTreino as TerçaInfo, 
   qinfo.NomePlanoTreino as QuartaInfo,
   quinfo.NomePlanoTreino as QuintaInfo,
   sexinfo.NomePlanoTreino as SextaInfo,
   sabinfo.NomePlanoTreino as SabadoInfo,
   dominfo.NomePlanoTreino as DomingoInfo
   
   FROM clienteinfo cl
   LEFT JOIN planotreinocliente ptc ON ptc.IdPlanoTreinoCliente = cl.idPlanoTreino
   LEFT JOIN planotreinoinfo sinfo ON sinfo.idPlanoTreinoInfo = ptc.IdPlanoInfoSegunda
   LEFT JOIN planotreinoinfo tinfo ON tinfo.idPlanoTreinoInfo = ptc.IdPlanoInfoTerca
   LEFT JOIN planotreinoinfo qinfo ON qinfo.idPlanoTreinoInfo = ptc.IdPlanoInfoQuarta
   LEFT JOIN planotreinoinfo quinfo ON quinfo.idPlanoTreinoInfo = ptc.IdPlanoInfoQuinta
   LEFT JOIN planotreinoinfo sexinfo ON sexinfo.idPlanoTreinoInfo = ptc.IdPlanoInfoSexta
   LEFT JOIN planotreinoinfo sabinfo ON sabinfo.idPlanoTreinoInfo = ptc.IdPlanoInfoSabado
   LEFT JOIN planotreinoinfo dominfo ON dominfo.idPlanoTreinoInfo = ptc.IdPlanoInfoDomingo
   LEFT JOIN colaboradores c ON c.idColaboradores = cl.idPtInfo
   WHERE c.nivel = 'pt' ORDER BY cl.ativo`;

 const [data] = await connection.execute(query);
 return data;

}



const getClientesColaboradores= async() =>{

  const [data] = await connection.execute("SELECT cl.*, c.telefone, c.idColaboradores, c.nome, c.email, c.perfil, c.capa, c.DataNasc, c.insta, c.descr from clienteinfo cl, colaboradores c WHERE c.idColaboradores=cl.idPtInfo and c.nivel='pt'");

  return data
   
}

const getAtividade= async() =>{

  const [data] = await connection.execute("SELECT * FROM atividade ORDER BY id DESC LIMIT 15");

  return data
}


const getPtData= async() =>{

  const [data]= await connection.execute("select * FROM colaboradores WHERE nivel='pt'")
  return data
}

const getEstatisticas = async () => {
  try {
    const [data1] = await connection.execute("SELECT COUNT(*) AS count1 FROM clienteinfo WHERE ativo != 1"); // First query
    const [data2] = await connection.execute("SELECT COUNT(*) AS count2 FROM colaboradores WHERE nivel = 'pt' AND ativo != 1"); // Second query
    const [data3] = await connection.execute("SELECT COUNT(*) AS count3 FROM colaboradores WHERE nivel = 'admin' AND ativo != 1"); // Third query    
    const [data4] = await connection.execute("SELECT COUNT(*) AS count4 FROM atividade WHERE email=1"); // Third query

    const total = data2[0].count2 + data3[0].count3; // Calculate total by summing counts from data2 and data3

    const result = {
      clientes: data1[0].count1,
      pts: data2[0].count2,
      admins: data3[0].count3,
      emails:data4[0].count4,
      percentagePts: ((data2[0].count2 / total)).toFixed(2), // Calculate percentage of data2
      percentageAdmins: ((data3[0].count3 / total)).toFixed(2), // Calculate percentage of data3
    };

    return result;
  } catch (error) {
    // Handle error here
    console.error("Error retrieving statistics:", error);
    throw error;
  }
};


const getEventos= async() =>{

  const [data]= await connection.execute("select * from eventos")
  return data
}


const getEventosOfWeek = async () => {

  const query = `SELECT date, DAYNAME(date) AS day_of_week FROM eventos
  WHERE tipo = 1 AND date >= DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-1 DAY) AND date <= DATE_ADD(CURDATE(), INTERVAL 7-DAYOFWEEK(CURDATE()) DAY);`;
  const [data] = await connection.execute(query);


const query1 = `SELECT * FROM eventos
  WHERE tipo = 1 AND date >= DATE_SUB(CURDATE(), INTERVAL DAYOFWEEK(CURDATE())-1 DAY) AND date <= DATE_ADD(CURDATE(), INTERVAL 7-DAYOFWEEK(CURDATE()) DAY);`;


  const [data1] = await connection.execute(query1);

  // Create an object with date keys and arrays of events as values
  const eventsByDate = {};
  data1.forEach((event) => {
    const dateKey = new Date(event.date).toISOString().slice(0, 10);
    eventsByDate[dateKey] = eventsByDate[dateKey] || [];
    eventsByDate[dateKey].push(event);
  });

  // Add day of week information to each event
  data.forEach((day) => {
    const dateKey = new Date(day.date).toISOString().slice(0, 10);
    if (eventsByDate[dateKey]) {
      eventsByDate[dateKey].forEach((event) => {
        event.day_of_week = day.day_of_week;
      });
    }
  });

  // Flatten eventsByDate object into an array
  const events = Object.values(eventsByDate).flat();
  console.log(events)
  return events;
};


const getColaboradores= async() =>{

    const [data]= await connection.execute("select * from colaboradores order by ativo")
    return data
}

const deleteColaboradores= async(Id,responsavel,nivel) =>{

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

    const [data]= await connection.execute("UPDATE colaboradores SET ativo = 1 WHERE idColaboradores = ?", [Id])

    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Colaborador Eliminado','"+responsavel+"','"+date+"','"+nivel+"', 0)")

    return data
}

const deleteAvaliacoes= async(Id,responsavel,nivel, Avl) =>{


  console.log("--------")
  console.log(Id)
  console.log("--------")
  
  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

  if(Avl == "false"){
    const [data]= await connection.execute("delete from MedidasCliente where IdMedidasCliente="+Id+"")
  }
  else{
    const [data]= await connection.execute("delete from TesteForcaCliente where IdTesteForcaCliente="+Id+"")
  }
  
    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Avaliação Eliminada','"+responsavel+"','"+date+"','"+nivel+"', 0)")

    return "apagado"
}

const deletePlanos= async(Id,responsavel,nivel) =>{

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

    const [data]= await connection.execute("UPDATE planotreinocliente SET ativo = 1 WHERE IdPlanoTreinoCliente = ?", [Id])

    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Plano Semanal Eliminado','"+responsavel+"','"+date+"','"+nivel+"', 0)")

    return data
}

const deletePlanosInfo= async(Id,responsavel,nivel) =>{

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

  const [data]= await connection.execute("UPDATE planotreinoinfo SET ativo = 1 WHERE IdPlanoTreinoInfo = ?", [Id])


    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Plano de Treino Eliminado','"+responsavel+"','"+date+"','"+nivel+"', 0)")

    return data
}

const deleteEvent= async(Id,responsavel,nivel) =>{

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

  const [data]= await connection.execute("delete from eventos where id='"+Id+"'")

  const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Evento Eliminado','"+responsavel+"','"+date+"','"+nivel+"', 0)")

    return data
}

const deleteClients= async(Id,responsavel,nivel) =>{

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 


    const [data]= await connection.execute("UPDATE clienteinfo SET ativo = 1 WHERE IdClienteInfo = ?", [Id])
    
    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel) VALUES('Cliente Eliminado','"+responsavel+"','"+date+"','"+nivel+"')")

    return data
}

const deleteExercicios= async(Id,responsavel,nivel) =>{

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 


  const [data]= await connection.execute("UPDATE exercicios SET ativo = 1 WHERE id = ?", [Id])

    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel) VALUES('Exercício Eliminado','"+responsavel+"','"+date+"','"+nivel+"')")

    return data
}

const getPtInfo= async() =>{

    const [Setdata]= await connection.execute("select c.telefone, c.idColaboradores, c.nome, c.email, c.perfil, c.capa, c.DataNasc, c.insta, c.descr from colaboradores c where c.nivel='pt' and ativo!=1")
    return Setdata
}

const getAulasGrupo= async(data) =>{
    
    const Dia=data
    const [Setdata]= await connection.execute("select * from aulaGrupo WHERE Dia='"+Dia+"'")
    return Setdata
}

const changePlanoDia= async(data) =>{
    
  const Dia = data.dia;
  const Id = data.id;
  const IdPlano = data.idplano;
  
  const query = `UPDATE planotreinocliente SET ${Dia} = ${Id} WHERE IdPlanoTreinoCliente = ${IdPlano}`;
  const [result] = await connection.execute(query);

  return result
}


const sendEmail = async (data) => {

  const { message, subject, emailToSend } = data;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

  const mailOptions = {
    from: email,
    to: emailToSend,
    subject: subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error(error);
  }
};


const TesteForcaCliente= async(IdCliente) =>{
    

    const Id=IdCliente
   

const query = `SELECT t.*, c.telefone, c.idColaboradores, c.nome, c.email, c.perfil, c.capa, c.DataNasc, c.insta, c.descr 
FROM TesteForcaCliente t
left JOIN colaboradores c ON t.IdPtInfo = c.idColaboradores
WHERE t.IdClienteInfo=`+Id+`
ORDER BY t.DataAvaliacao DESC`;
const [Setdata] = await connection.execute(query);


   // const [Setdata]= await connection.execute("select t.*, c.telefone, c.idColaboradores, c.nome, c.email, c.perfil, c.capa, c.DataNasc, c.insta, c.descr from TesteForcaCliente t, colaboradores c WHERE t.IdClienteInfo='"+Id+"' AND t.IdPtInfo=c.idColaboradores ORDER BY t.DataAvaliacao DESC")
    let contador=Setdata.length+1
    for (let j = 0; j < Setdata.length; j++) {
        contador--
        Object.assign(Setdata[j], { NumeroAvaliacao: contador });
      }
    return Setdata
    
}

const MedidasCliente= async(IdCliente) =>{
    
   
    const Id=IdCliente

    const query = `SELECT m.*, c.telefone, c.idColaboradores, c.nome, c.email, c.perfil, c.capa, c.DataNasc, c.insta, c.descr 
FROM MedidasCliente m
left JOIN colaboradores c ON m.IdPtInfo=c.idColaboradores
WHERE m.IdClienteInfo=`+Id+`
ORDER BY m.DataAvaliacao DESC`;
const [Setdata] = await connection.execute(query);

      let contador=Setdata.length+1
    for (let j = 0; j < Setdata.length; j++) {
        contador--
        Object.assign(Setdata[j], { NumeroAvaliacao: contador });
      }
    return Setdata
    
}


const uploadImages= async(data) =>{
    

  
}

const getPlanosTreino= async(IdCliente) =>{


    const Id=IdCliente
    var diaCollumArray=["IdPlanoInfoSegunda","IdPlanoInfoTerca","IdPlanoInfoQuarta","IdPlanoInfoQuinta","IdPlanoInfoSexta","IdPlanoInfoSabado"]
    var array=[]
    for(var i=0;i<diaCollumArray.length;i++){

          const query = `SELECT p.nomeGrupoPlanos, pt.ativo, pt.NomePlanoTreino, pt.ListaExercicios, pt.ListaRepeticoesExercicio, pt.DuracaoPlanoTreino, p.ativo as ativoSemanal, pt.ListaVideoExercicio, c.nome
  FROM planotreinocliente p
  INNER JOIN planotreinoinfo pt ON p.`+diaCollumArray[i]+` = pt.IdPlanoTreinoInfo
  LEFT JOIN colaboradores c ON pt.IdPtinfo = c.idColaboradores
  WHERE p.IdPlanoTreinoCliente=`+Id+`;`;

const [Setdata] = await connection.execute(query);
        const responseData=Setdata
        const isEmpty = responseData.every(innerArray => innerArray.length === 0)
        if(isEmpty){
            console.log("esta vazio "+diaCollumArray[i])
        }
        else{                   
            for (let j = 0; j < Setdata.length; j++) {
                Object.assign(Setdata[j], { Day: diaCollumArray[i] });
              }
            array.push(Setdata)
        }
    
    }
  

    return array
}


const updateClientesApp=async(data)=>{
  const IdClienteInfo=data.IdClienteInfo
  const Email=data.Email
  const Nome=data.Nome
  const Senha=data.Senha
  const Atividade = data.ativo
console.log(Atividade)
  const [UpdateData] = await connection.execute("UPDATE clienteinfo set NomeCliente='"+Nome+"', ativo="+Atividade+", Senha='"+Senha+"',EmailCliente='"+Email+"' WHERE IdClienteInfo="+IdClienteInfo+"")
  
      
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });
  
    const mailOptions = {
      from: email,
      to: Email,
      subject: "Os seus dados foram alterados",
      html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Os seus dados passam a ser os seguintes:</p>
      <div style="background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
        <p style="font-size: 18px; font-weight: bold; margin: 0;">Nome: ${Nome}</p>
        <p style="font-size: 18px; font-weight: bold; margin: 0;">Senha: ${Senha}</p>
        <p style="font-size: 18px; font-weight: bold; margin: 0;">Email: ${Email}</p>
      </div>
      <p>Caso alguma coisa esteja incorreta fale connosco</p>
      <br></br>
      <p style="color: rgb(29, 17, 94); font-weight: bold; font-size: 20px; "> EQUIPA FITARENA</p>
    </div>
    `
    };
    
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error(error);
    }


    return UpdateData
}


const alterarSenha=async(data)=>{

  const Senha = data.senha
  const Email = data.email


      const [UpdateData] = await connection.execute("UPDATE colaboradores set password='"+Senha+"' WHERE email='"+Email+"'")
  
      
      const mailOptions  = {
        from: email,
        to: Email,
        subject: "Senha Alterada",
        html: `<!DOCTYPE html>
    <html lang="en" >
    <head>
    <meta charset="UTF-8">
    
    
    </head>
    <body>
    <!-- partial:index.partial.html -->
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FITARENA</a>
      </div>
      <p style="font-size:1.1em">Olá,</p>
      <p>A sua senha foi alterada e passa a ser esta:</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${Senha}</h2>
      <p style="font-size:0.9em;">Atenciosamente,<br />FITARENA</p>
      <hr style="border:none;border-top:1px solid #eee" />
    </div>
    </div>
    <!-- partial -->
    
    </body>
    </html>`,
      };
      
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.error(error);
      }
    

    return "sucesso"

}


const updateEvents=async(data)=>{

  const NewDate = data.newDate
  const EventName = data.eventName
  const Responsavel = data.responsavel
  const NivelResponsavel = data.nivelResponsavel
  const Id=data.id
  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0];


  
      const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Nova data para o evento "+EventName+" ','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")
  
      const [UpdateData] = await connection.execute("UPDATE eventos set date='"+NewDate+"' WHERE id="+Id+"")
  
        
      
      const [rows]= await connection.execute("select * from colaboradores")


      rows.forEach(async (element) => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: email,
            pass: password,
          },
        });
      
        const mailOptions = {
          from: email,
          to: element.email,
          subject: "Evento alterado",
          html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>Olá ${element.nome}.</p>
          <p>Gostariamos de informar-lo que o evento ${EventName} teve a sua data alterada, vai ocorrer em ${NewDate}</p>
          <p>Se tiver alguma dúvida não exite em perguntar.</p>
          <p style="color: rgb(29, 17, 94); font-weight: bold; font-size: 20px; ">EQUIPA FITARENA</p>
        </div>
        `
        };
        
      
        try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent: ' + info.response);
        } catch (error) {
          console.error(error);
        }
      });

    


    return "sucesso"

}


const updateClientes=async(data)=>{

  const Atividade = data.ativo
  const NivelResponsavel = data.nivelResponsavel
  const Responsavel = data.responsavel
  const IdClienteInfo=data.IdClienteInfo
  const Email=data.Email
  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

    if(data.plano){
      const PlanoId=data.plano
      const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Plano de treino do cliente atualizado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")
  
      const [UpdateData] = await connection.execute("UPDATE clienteinfo set idPlanoTreino='"+PlanoId+"' WHERE IdClienteInfo="+IdClienteInfo+"")
  
        
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email,
          pass: password,
        },
      });
    
      const mailOptions = {
        from: email,
        to: Email,
        subject: "Você tem um novo plano de treino",
        html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Você tem um novo plano de treino, este poderá ser visto na sua aplicação</p>
        <p>Caso tenha alguma dúvida fale com o seu Pt ou contacte-nos.</p>
        <br></br>
        <p style="color: rgb(29, 17, 94); font-weight: bold; font-size: 20px; "> EQUIPA FITARENA</p>
      </div>
      `
      };
      
    
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.error(error);
      }
    }
    else{

    
      const Nome=data.Nome
      const Senha=data.Senha

      const IdPtInfo=data.IdPtInfo


    
        const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Cliente Alterado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")
  
      const [UpdateData] = await connection.execute("UPDATE clienteinfo set NomeCliente='"+Nome+"', idPtInfo ="+IdPtInfo+", Senha='"+Senha+"',EmailCliente='"+Email+"' WHERE IdClienteInfo="+IdClienteInfo+"")
  
      
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: email,
            pass: password,
          },
        });
      
        const mailOptions = {
          from: email,
          to: Email,
          subject: "Os seus dados foram alterados",
          html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>Os seus dados passam a ser os seguintes:</p>
          <div style="background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
            <p style="font-size: 18px; font-weight: bold; margin: 0;">Nome: ${Nome}</p>
            <p style="font-size: 18px; font-weight: bold; margin: 0;">Senha: ${Senha}</p>
            <p style="font-size: 18px; font-weight: bold; margin: 0;">Email: ${Email}</p>
          </div>
          <p>Caso alguma coisa esteja incorreta fale connosco</p>
          <br></br>
          <p style="color: rgb(29, 17, 94); font-weight: bold; font-size: 20px; "> EQUIPA FITARENA</p>
        </div>
        `
        };
        
      
        try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent: ' + info.response);
        } catch (error) {
          console.error(error);
        }
  
    }

   


    return "sucesso"

}


const addPlanoTreino=async(data)=>{


  const Responsavel=data.responsavel
  const Nome=data.nome
  const segunda=data.segunda
  const terca=data.terca
  const quarta=data.quarta
  const quinta=data.quinta
  const sexta=data.sexta
  const sabado=data.sabado
  const NivelResponsavel = data.nivelResponsavel

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Plano Semanal Adicionado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")

    const [data2]=await connection.execute("INSERT INTO planotreinocliente (nomeGrupoPlanos,IdPlanoInfoSegunda, IdPlanoInfoTerca, IdPlanoInfoQuarta , IdPlanoInfoQuinta , IdPlanoInfoSexta , IdPlanoInfoSabado) VALUES('"+Nome+"','"+segunda+"','"+terca+"','"+quarta+"' ,'"+quinta+"' ,'"+sexta+"' ,'"+sabado+"')")

      return "sucesso"
}


const addPlanoTreinoInfo=async(data)=>{


  const Responsavel=data.responsavel
  const Nome=data.nome
  const ListaIds=data.listaIds
  const ListaReps=data.listaReps
  const Duracao=data.duracao
  const NivelResponsavel = data.nivelResponsavel

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Plano de Treino Adicionado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")

    const [data2]=await connection.execute("INSERT INTO planotreinoinfo (NomePlanoTreino,ListaExercicios, DuracaoPlanoTreino, ListaRepeticoesExercicio) VALUES('"+Nome+"','"+ListaIds+"','"+Duracao+"','"+ListaReps+"')")

      return "sucesso"
}

const recuperar = async (data) => {

  const Email =data.email
  const OTP = data.OTP

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });


  const mailOptions  = {
    from: email,
    to: Email,
    subject: "Recuperação de Senha",
    html: `<!DOCTYPE html>
<html lang="en" >
<head>
<meta charset="UTF-8">



</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FITARENA</a>
  </div>
  <p style="font-size:1.1em">Olá,</p>
  <p>Utilize o seguinte código de verificação para concluir o procedimento de recuperação de senha. O código é válido por 5 minutos</p>
  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
  <p style="font-size:0.9em;">Atenciosamente,<br />FITARENA</p>
  <hr style="border:none;border-top:1px solid #eee" />
</div>
</div>
<!-- partial -->

</body>
</html>`,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error(error);
  }
};


const addMedidas = async (data) => {
  try {
    const Responsavel = data.responsavel;
    const peso = data.peso;
    const altura = data.altura;
    const quadril = data.quadril;
    const DataAvaliacao = data.dataAvaliacao;
    const coxaDire = data.coxaDire;
    const costas = data.costas;
    const coxaEsq = data.coxaEsq;
    const antebracoEsq = data.antebracoEsq;
    const bracoEsq = data.bracoEsq;
    const antebracoDire = data.antebracoDire;
    const cintura = data.cintura;
    const bracoDire = data.bracoDire;
    const gemeoDire = data.gemeoDire;
    const gemeoEsq = data.gemeoEsq;
    const peito = data.peito;
    const dorsal = data.dorsal;
    const pescoco = data.pescoco;
    const Id = data.id;
    const IdColaboradores = data.pt;
    const NivelResponsavel = data.nivelResponsavel;

    const H20 = data.H20;
    const PesoMassaOssea = data.PesoMassaOssea;
    const Bioimpedancia = data.Bioimpedancia;
    const GorduraViceral = data.GorduraViceral;
    const PesoMassaMuscular = data.PesoMassaMuscular;
    const TaxaMetabolicaBasal = data.TaxaMetabolicaBasal;
    const IdadeMetabolica = data.IdadeMetabolica;

    const Escoliose = data.Escoliose;
    const AlinhaJoelho = data.AlinhaJoelho;
    const Femural = data.Femural;
    const STR = data.STR;

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];

    // Check if a row with the same DataAvaliacao already exists
    const checkQuery = `SELECT * FROM MedidasCliente WHERE DataAvaliacao = '${DataAvaliacao}' AND IdClienteInfo = ${Id}`;
    const [existingRow] = await connection.execute(checkQuery);

    if (existingRow.length > 0) {
      console.log("Já existe uma avaliação nessa data")
      // Row already exists, throw an error
      throw new Error("Já existe uma avaliação nessa data");
    }

    // Insert the new row
    const [data1] = await connection.execute(
      "INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Avaliação do tipo medidas adicionada', ?, ?, ?, 1)",
      [Responsavel, date, NivelResponsavel]
    );

    const [data2] = await connection.execute(
      "INSERT INTO MedidasCliente (Peso, Altura, Quadril, CoxaEsq, CoxaDire, Costas, BracoEsq, BracoDire, Cintura, GemeoEsq, GemeoDire, DataAvaliacao, Peito, Dorsal, Pescoco, IdClienteInfo, IdPtInfo, antebracoDire, antebracoEsq, H20, PesoMassaOssea, Bioimpedancia, GorduraViceral, PesoMassaMuscular, TaxaMetabolicaBasal, IdadeMetabolica, Escoliose, AlinhaJoelho, Femural, STR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        peso,
        altura,
        quadril,
        coxaEsq,
        coxaDire,
        costas,
        bracoEsq,
        bracoDire,
        cintura,
        gemeoEsq,
        gemeoDire,
        DataAvaliacao,
        peito,
        dorsal,
        pescoco,
        Id,
        IdColaboradores,
        antebracoDire,
        antebracoEsq,
        H20,
        PesoMassaOssea,
        Bioimpedancia,
        GorduraViceral,
        PesoMassaMuscular,
        TaxaMetabolicaBasal,
        IdadeMetabolica,
        Escoliose,
        AlinhaJoelho,
        Femural,
        STR
      ]
    );
    

    return "sucesso";
  } catch (error) {
    throw error;
  }
};



const addFisico = async (data) => {
  try {
    const Responsavel = data.responsavel;
    const Supino = data.supino;
    const Agachamento = data.agachamento;
    const Terra = data.terra;
    const DataAvaliacao = data.dataAvaliacao;
    const Id = data.id;
    const IdColaboradores = data.pt;
    const NivelResponsavel = data.nivelResponsavel;

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];

    // Check if a row with the same DataAvaliacao already exists
    const checkQuery = `SELECT * FROM TesteForcaCliente WHERE DataAvaliacao = '${DataAvaliacao}' AND IdClienteInfo = ${Id}`;
    const [existingRow] = await connection.execute(checkQuery);

    if (existingRow.length > 0) {
      console.log("Já existe uma avaliação nessa data")
      // Row already exists, throw an error
      throw new Error("Já existe uma avaliação nessa data");
    }

    // Insert the new row
    const [data1] = await connection.execute(
      "INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Avaliação do tipo fisico adicionada', ?, ?, ?, 1)",
      [Responsavel, date, NivelResponsavel]
    );

    const [data2] = await connection.execute(
      "INSERT INTO TesteForcaCliente (Supino, Agachamento, Terra, DataAvaliacao, IdClienteInfo, IdPtInfo) VALUES (?, ?, ?, ?, ?, ?)",
      [Supino, Agachamento, Terra, DataAvaliacao, Id, IdColaboradores]
    );

    return "sucesso";
  } catch (error) {
    throw error;
  }
};


const addExercicio=async(data)=>{


  const Responsavel=data.responsavel
  const Nome=data.nome
  const Source=data.source
  const Rest=data.rest
  const NivelResponsavel = data.nivelResponsavel

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Exercicio Adicionado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")

    const [data2]=await connection.execute("INSERT INTO exercicios (nome,source,rest) VALUES('"+Nome+"','"+Source+"','"+Rest+"')")

      return "sucesso"
}

const activatePlanoSemanal=async(data)=>{

  const Atividade = data.ativo

    const Id=data.id

  

      const [data2]=await connection.execute("UPDATE planotreinocliente set ativo=0 WHERE IdPlanoTreinoCliente="+Id+" ")
  
        return "sucesso"
  }

const updateExercicio=async(data)=>{

const Atividade = data.ativo
  const Responsavel=data.responsavel
  const Nome=data.nome
  const Id=data.id
  const Source=data.source
  const Rest=data.rest
  const NivelResponsavel = data.nivelResponsavel

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Exercicio Alterado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")

    const [data2]=await connection.execute("UPDATE exercicios set nome='"+Nome+"', source='"+Source+"', ativo='"+Atividade+"', rest='"+Rest+"' WHERE id="+Id+" ")

      return "sucesso"
}

const updatePlanoInfo=async(data)=>{


  const Responsavel=data.responsavel
  const ListaExercicios=data.listaExercicios
  const Id=data.id
  const Ativo=data.ativo
  const ListaRepeticoes=data.listaRepeticoes
  const NivelResponsavel = data.nivelResponsavel

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Colaborador Alterado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")

    const [data2]=await connection.execute("UPDATE planotreinoinfo set ListaExercicios='"+ListaExercicios+"', ativo='"+Ativo+"', ListaRepeticoesExercicio='"+ListaRepeticoes+"' WHERE IdPlanoTreinoInfo="+Id+" ")

      return "sucesso"
}


const updateColaboradores=async(data)=>{

    const Atividade = data.ativo
    const IdColaboradores=data.idColaboradores
    const Nome=data.nome
    const Telefone=data.telefone
    const Email=data.email
    const Senha=data.senha     
    const Nivel=data.nivel
    const Responsavel=data.responsavel
    const DataNasc=data.dataNasc
    const Perfil=data.perfil
    const Capa=data.capa
    const Insta=data.insta
    const Descr=data.descr
    const NivelResponsavel = data.nivelResponsavel


    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0]; 
  
      const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Colaborador Alterado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")
      console.log("---------")
      console.log(data)
      console.log(Perfil)
      console.log(Senha)
      if (Senha !== "") {
        console.log("entrou1")
        const [UpdateData] = await connection.execute("UPDATE colaboradores SET insta = '" + Insta + "', descr = '" + Descr + "', ativo = " + Atividade + ", capa = '" + Capa + "', nome = '" + Nome + "', telefone = '" + Telefone + "', email = '" + Email + "', nivel = '" + Nivel + "', DataNasc = '" + DataNasc + "', perfil = '" + Perfil + "' WHERE idColaboradores = " + IdColaboradores);
      } else {
        console.log("entrou2")
        const [UpdateData] = await connection.execute("UPDATE colaboradores SET insta = '" + Insta + "', descr = '" + Descr + "', ativo = " + Atividade + ", capa = '" + Capa + "', nome = '" + Nome + "', telefone = '" + Telefone + "', email = '" + Email + "', nivel = '" + Nivel + "', DataNasc = '" + DataNasc + "', perfil = '" + Perfil + "' WHERE idColaboradores = " + IdColaboradores);

      }
      

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email,
          pass: password,
        },
      });
    
      const mailOptions = {
        from: email,
        to: Email,
        subject: "Os seus dados foram alterados",
        html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Os seus dados foram alterados pelo ${Responsavel}.</p>
        <p>Os seus dados passam a ser os seguintes:</p>
        <div style="background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
          <p style="font-size: 18px; font-weight: bold; margin: 0;">Nome: ${Nome}</p>
          <p style="font-size: 18px; font-weight: bold; margin: 0;">Email: ${Email}</p>
          <p style="font-size: 18px; font-weight: bold; margin: 0;">Telefone: ${Telefone}</p>
          <p style="font-size: 18px; font-weight: bold; margin: 0;">Cargo: ${Nivel}</p>
        </div>
        <p>Caso alguma coisa esteja incorreta comunique a um superior para que a ação seja analisada</p>
        <br></br>
        <p style="color: rgb(29, 17, 94); font-weight: bold; font-size: 20px; "> EQUIPA FITARENA</p>
      </div>
      `
      };
      
    
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.error(error);
      }


console.log ("acabou")
    return "sucesso"

}


const createEvent=async(data)=>{

  const Tipo=data.tipo
  const Title=data.title
  const Data=data.date
  const Horario=data.horario
  const NivelResponsavel = data.nivelResponsavel
  const Responsavel = data.responsavel

  const currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0]; 

    const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Evento Adicionado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")


  const [UpdateData] = await connection.execute("INSERT INTO eventos (tipo, title, date, horario) VALUES('"+Tipo+"','"+Title+"','"+Data+"','"+Horario+"')")

  const [rows]= await connection.execute("select * from colaboradores")


  rows.forEach(async (element) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });
  
    const mailOptions = {
      from: email,
      to: element.email,
      subject: "Novo evento",
      html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Olá ${element.nome}.</p>
      <p>Gostariamos de informar-lo que dia ${Date} vai ocorrer o evento ${Title}</p>
      <p>Se tiver alguma dúvida não exite em perguntar.</p>
      <p style="color: rgb(29, 17, 94); font-weight: bold; font-size: 20px; ">EQUIPA FITARENA</p>
    </div>
    `
    };
    
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error(error);
    }
  });



  return UpdateData

}


const addPts=async(data)=>{

  const Nome=data.nome
  const Telefone=data.telefone
  const Email=data.email
  const DataNasc=data.dataNasc

  const [UpdateData] = await connection.execute("INSERT INTO ptinfo (NomePt, TelefonePt, EmailPt, DataNascPt) VALUES('"+Nome+"','"+Telefone+"','"+Email+"','"+DataNasc+"')")

  return UpdateData

}


const addColaboradores=async(data)=>{

    const Password=data.password
    const Nome=data.nome
    const Telefone=data.telefone
    const Email=data.email
    const Nivel=data.nivel
    const Perfil=data.perfil
    const DataNasc=data.dataNasc
    const NivelResponsavel = data.nivelResponsavel
    const Responsavel = data.responsavel

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0]; 
  
      const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Colaborador Adicionado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")


    const [UpdateData] = await connection.execute("INSERT INTO colaboradores (password, nome, telefone, email, nivel, perfil, DataNasc) VALUES('"+Password+"','"+Nome+"','"+Telefone+"','"+Email+"','"+Nivel+"','"+Perfil+"','"+DataNasc+"')")

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email,
          pass: password,
        },
      });
    
      const mailOptions = {
        from: email,
        to: Email,
        subject: "Bem vindo à equipa",
        html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Bem vindo à equipa FITARENA, ${Nome}.</p>
        <p>É um prazer ter-lo como o nosso novo ${Nivel}</p>
        <p>A sua senha é:</p>
        <div style="background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
          <p style="font-size: 18px; font-weight: bold; margin: 0;">${Password}</p>
        </div>
        <p>Protega a sua senha. Você poderá mais tarde alterá-la no site administrativo.</p>
        <p>Se tiver alguma dúvida não exite em perguntar, estamos aqui para o fazer sentir parte da família.</p>
        <p style="color: rgb(29, 17, 94); font-weight: bold; font-size: 20px; ">EQUIPA FITARENA</p>
      </div>
      `
      };
      
    
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.error(error);
      }



    return UpdateData

}


const create=async(data,codigoCliente,senha)=>{
    
    const EmailCliente=data.EmailCliente
    const DataNascCliente=data.DataNascCliente
    const NomeCliente=data.NomeCliente
    const IdPtInfo=data.idPtInfo
    const NivelResponsavel = data.nivelResponsavel
    const Responsavel = data.responsavel

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0]; 
  
      const [data1]=await connection.execute("INSERT INTO atividade (tipo, responsavel, data, nivel, email) VALUES('Cliente Adicionado','"+Responsavel+"','"+date+"','"+NivelResponsavel+"', 1)")

    const [createData] = await connection.execute("INSERT INTO clienteinfo (NomeCliente,CodigoCliente,Senha,EmailCliente,DataNascCliente,idPtInfo) VALUES('"+NomeCliente+"','"+codigoCliente+"','"+senha+"','"+EmailCliente+"','"+DataNascCliente+"',"+IdPtInfo+")")
   
   
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email,
          pass: password,
        },
      });
    
      const mailOptions = {
        from: email,
        to: EmailCliente,
        subject: 'Bem vindo à familia FITARENA!',
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <p>Parabéns ${NomeCliente}.</p>
            <p>Você acabou de realizar o primeiro passo para alcançar o seu fisíco de sonho!</p>
            <p>A sua senha é:</p>
            <div style="background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
              <p style="font-size: 18px; font-weight: bold; margin: 0;">${senha}</p>
            </div>
            <p>Protega a sua senha. Você poderá mais tarde alterá-la na sua aplicação.</p>
            <p>Se tiver alguma dúvida não exite em nos contactar.</p>
            <p style="color: rgb(29, 17, 94); font-weight: bold; font-size: 20px; ">EQUIPA FITARENA</p>
          </div>
        `
      };
      
    
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.error(error);
      }


    return createData

}

module.exports={
    getClientes,
    create,
    getAulasGrupo,
    getPlanosTreino,
    updateClientes,
    MedidasCliente,
    TesteForcaCliente,
    getPtInfo,
    getColaboradores,
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