const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // Require the body-parser module
const DbHandler = require('./src/database/dbHandler'); // Require the dbHandler.js file
const GPTApiHandler = require('./src/gpt-api/gptHandler'); // Require the dbHandler.js file
const fs = require('fs');

const dbHandler = new DbHandler();
const gptApiHandler = new GPTApiHandler();

dbHandler.InitializeDB();

// Configure body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// handling CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://shilmanlior2608.ddns.net:8433");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Private-Network: true");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE,OPTIONS"); // Add OPTIONS method
  next();
});

// route for handling requests from the Angular client
app.get('/api/message', (req, res) => {
  res.json({
    message: 'Hello from the Express server!'
  });
});

// Write data to a file
app.post('/api/writeFile', (req, res) => {
  const { content,filePathChat} = req.body;
  //const serializedData = JSON.stringify(data);
  const serializedContent = JSON.stringify(content);

/*   fs.writeFile(filePathGptChat, serializedData, (err) => {
    if (err) {
      res.status(500).send('Error writing to file');
    }
  });
 */

  fs.writeFile(filePathChat, serializedContent, (err) => {
    if (err) {
      res.status(500).send('Error writing to report file');
    }
  });

  res.send('Data written to report file successfully');
});

// Read data from a file
app.get('/api/readFile/:id', async (req, res) => {
  const filePath = req.params.filePath;

  let parsedDataGptChat = "";
  let parsedDataChat = "";

  try {
    //const file1Content = await fs.promises.readFile(`chats/${req.params.id}.txt`, 'utf8');
    //parsedDataGptChat = JSON.parse(file1Content);
    //console.log(parsedDataGptChat);

    const file2Content = await fs.promises.readFile(`chats/${req.params.id}_chat.txt`, 'utf8');
    parsedDataChat = JSON.parse(file2Content);
    //console.log(parsedDataChat);

    gptApiHandler.saveMemory(parsedDataChat);

    //console.log({ parsedDataGptChat, parsedDataChat });
    res.send({ chat: parsedDataChat });
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).send('Error reading file');
  }
});

// route for handling POST requests from the Angular client
app.post('/api/prompt', (req, res) => {
  // Handle the POST request here
  // You can access the request body using req.body
  // Example: const prompt = req.body.prompt;
  // Perform necessary operations with the prompt data
  // Send a response back if needed
  //console.log('/api/prompt');

  gptApiHandler.sendRoleUserPrompt(req.body.chat,req.body.gptVersion).then(resultApi => {
    //console.log("resultApi - " + resultApi);
    res.send({
      res: resultApi
    });
  });
});

// route for handling POST requests from the Angular client
app.post('/api/saveProject', (req, res) => {
  dbHandler.SaveProject(req.body.project).then(result => {
    //console.log("result - " + result);
    res.send({
      res: result
    });
  });
});

app.delete('/api/removeUser/:userId', (req, res) => {

  //console.log("/api/removeUser/:userId");
  dbHandler.RemoveUserByID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});


// route for handling requests from the Angular client
app.get('/api/getAllUsers', (req, res) => {

  dbHandler.GetAllUsers().then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getFinanceAdvisorByUser/:userId', (req, res) => {

  dbHandler.GetFinanceAdvisorByUser(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getPersonalDataByUser/:userId', (req, res) => {

  dbHandler.GetPersonalDataByUser(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getChildrenByPersonID/:parentId', (req, res) => {

  dbHandler.GetChildrenByPersonID(`${req.params.parentId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getRelativesByParentsID/:partner1Id/:partner2Id', (req, res) => {

  dbHandler.GetRelativesByParentsID(`${req.params.partner1Id}`, `${req.params.partner2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getIncomesByPersonID/:person1Id/:person2Id', (req, res) => {

  dbHandler.GetIncomesByPersonID(`${req.params.person1Id}`, `${req.params.person2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getIncomesExByPersonID/:userId', (req, res) => {

  dbHandler.GetIncomesExByPersonID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getFixedExpensesByUserID/:userId', (req, res) => {

  dbHandler.GetFixedExpensesByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getSavingByUserID/:userId', (req, res) => {

  dbHandler.GetSavingByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getRealEstatesByUserID/:userId', (req, res) => {

  dbHandler.GetRealEstatesByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getVehiclesByUserID/:userId', (req, res) => {

  dbHandler.GetVehiclesByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getFinanceLiquidityAssetByUserID/:userId', (req, res) => {

  dbHandler.GetFinanceLiquidityAssetByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getFinanceUnliquidityAssetByUserID/:userId', (req, res) => {

  dbHandler.GetFinanceUnliquidityAssetByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getCommitmentsByUserID/:userId', (req, res) => {

  dbHandler.GetCommitmentsByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getCurrentFlowByUserID/:userId', (req, res) => {

  dbHandler.GetCurrentFlowByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});


app.get('/api/getMortgagesByUserID/:userId', (req, res) => {

  dbHandler.GetMortgagesByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getLifeInsuranceByPersonID/:person1Id/:person2Id', (req, res) => {

  dbHandler.GetLifeInsuranceByPersonID(`${req.params.person1Id}`, `${req.params.person2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getPensionJointUserID/:userId', (req, res) => {

  dbHandler.GetPensionJointUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getSocialSecurityBenefitsPersonID/:person1Id/:person2Id', (req, res) => {

  dbHandler.GetSocialSecurityBenefitsPersonID(`${req.params.person1Id}`, `${req.params.person2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getOldPensionFundPersonID/:person1Id/:person2Id', (req, res) => {

  dbHandler.GetOldPensionFundPersonID(`${req.params.person1Id}`, `${req.params.person2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getPensionFundPersonID/:person1Id/:person2Id', (req, res) => {

  dbHandler.GetPensionFundPersonID(`${req.params.person1Id}`, `${req.params.person2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getGemelPersonID/:person1Id/:person2Id', (req, res) => {

  dbHandler.GetGemelPersonID(`${req.params.person1Id}`, `${req.params.person2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});


app.get('/api/getManagerInsurancePersonID/:person1Id/:person2Id', (req, res) => {

  dbHandler.GetManagerInsurancePersonID(`${req.params.person1Id}`, `${req.params.person2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getVariableExpensesByUserID/:userId', (req, res) => {

  dbHandler.GetVariableExpensesByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getLifeLongCareInsurancesInHealthByPersonID/:person1Id/:person2Id', (req, res) => {

  dbHandler.GetLifeLongCareInsurancesInHealthByPersonID(`${req.params.person1Id}`, `${req.params.person2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getLifeLongCareInsurancesInInsuranceCompanyByPersonID/:person1Id/:person2Id', (req, res) => {

  dbHandler.GetLifeLongCareInsurancesInInsuranceCompanyByPersonID(`${req.params.person1Id}`, `${req.params.person2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getLifeLongCareInsurancesInInsuranceCompany4ChildrensByUserID/:userId', (req, res) => {
  dbHandler.GetLifeLongCareInsurancesInInsuranceCompany4ChildrensByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getHealthInsuranceByUserID/:userId', (req, res) => {

  dbHandler.GetHealthInsuranceByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getRepetitiveGoalsByUserID/:userId', (req, res) => {

  dbHandler.GetRepetitiveGoalsByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getEconomicalStabilityByUserID/:userId', (req, res) => {

  dbHandler.GetEconomicalStabilityByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getIncomesGoalByUserID/:userId', (req, res) => {

  dbHandler.GetIncomesGoalByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.get('/api/getOneOffFamilyGoalByUserID/:userId', (req, res) => {

  dbHandler.GetOneOffFamilyGoalByUserID(`${req.params.userId}`).then(result => {
    res.send({
      res: result
    });
  });
});




app.get('/api/getLossOfWorkingCapacityPersonID/:person1Id/:person2Id', (req, res) => {

  dbHandler.GetLossOfWorkingCapacityPersonID(`${req.params.person1Id}`, `${req.params.person2Id}`).then(result => {
    res.send({
      res: result
    });
  });
});

app.options('/api/prompt', (req, res) => {
  res.sendStatus(200); // Respond with HTTP OK status
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});
