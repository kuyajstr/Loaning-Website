//#region LOGIN
function loginVerification(e) {
  event.preventDefault();

  if (verifyLogin()) {
    alert("Login Successfuly!");
    loginModal.style.display = 'none';
  }
  else {
    alert("Login Failed!");
  }

  resetLoginForm();
}

function verifyLogin(formData) {

  var userIn = document.getElementById("logUser").value;
  var passIn = document.getElementById("logPass").value;

  if (!(userIn === "admin")) return false;
  if (!(passIn === "asd")) return false;

  return true;
}

//Reset the data
function resetLoginForm() {
  document.getElementById('logUser').value = '';
  document.getElementById('logPass').value = '';
}

// Get DOM Elements
const loginModal = document.querySelector('#loginModal');
const logOutBtn = document.querySelector('#logOut');

// Events
logOutBtn.addEventListener('click', openLoginModal);

// Open
function openLoginModal() {
  resetLoginForm();
  loginModal.style.display = 'block'; 
}
//#endregion

//#region REPORT
//#region Daily Report
function daySelectorChange(tableId) {
  deleteTableData(tableId);
  generateTableData(tableId);
  getDailyTotal(tableId);
}

function deleteTableData(tableId) {
  var table = document.getElementById(tableId).getElementsByTagName('tbody')[0];

  tableSize = table.rows.length;;

  for (let i = 0; i < tableSize; i++)
      table.deleteRow(0);
}

function generateTableData(tableId) {
  var table = document.getElementById(tableId).getElementsByTagName('tbody')[0];

  const names = ["Junnie", "Cong", "Yow", "Keng", "Pau", "Dudut"];

  //get a random integer between 0 to 9
  var maxRows = getRandomNum(0, 9);

  for (let i = 0; i < maxRows; i++) {

      var row = table.insertRow(0);

      var name = row.insertCell(0);
      var amount = row.insertCell(1);

      name.innerHTML = names[getRandomNum(0, names.length)];
      amount.innerHTML = getRandomNum(1, 10) * 1000;
  }
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getDailyTotal(tableId) {
  var table = document.getElementById(tableId).getElementsByTagName('tbody')[0];

  var total = 0;
  var text = "";

  for (var i = 0; i < table.rows.length; i++) {
      var amount = table.rows[i].cells[1].innerHTML;
      total += parseInt(amount);
  }

  total = total.toFixed(2)

  switch (tableId) {
      case 'dailyPaymentList':
          text = `Daily total payment is Php ${total}`;
          document.getElementById('dailyTotalPayment').innerHTML = text;
          break;
      case 'dailyLoanList':
          text = `Daily total loan is Php ${total}`;
          document.getElementById('dailyTotalLoan').innerHTML = text;
          break;
      default:
          alert("error getting sum");
  }
}
//#endregion

//#region Monthly Report
var paymentCanvas = document.getElementById('monthlyPaymentChart');
var loanCanvas = document.getElementById('monthlyLoanChart');

var paymentChart = createChart(paymentCanvas);
var loanChart = createChart(loanCanvas);

function createChart(canvasPlacement, chartDataSet = {}) {
  return new Chart(canvasPlacement, {
      type: 'bar',
      data: chartDataSet,
      options: {
          scales: {
              yAxes: [{
                  scaleLabel: {
                      display: true,
                      labelString: 'Amount (in thousand)'
                  },
                  ticks: {
                      beginAtZero: true,
                      steps: 10,
                      stepValue: 5,
                      max: 250
                  }
              }],
              xAxes: [{
                  scaleLabel: {
                      display: true,
                      labelString: 'Week'
                  }
              }]
          }
      }
  });
}

function monthSelectorChange(element) {
  var canvas = element.parentElement.getElementsByTagName('canvas')[0];
  var totalSpan = element.parentElement.getElementsByTagName('span')[0];
  
  // console.log(canvas);
  // console.log(totalSpan);

  var chartToCreate;

  switch (canvas.id) {
      case 'monthlyPaymentChart':
          console.log('payment');
          chartToCreate = paymentChart;
          break;
      case 'monthlyLoanChart':
          console.log('loan');
          chartToCreate = loanChart;
          break;
  }

  generateChart(chartToCreate,canvas)
}

function generateChart(chart,canvas) {
  chart.destroy();
  
  var chartData = GenerateData();

  var dataset = {
      labels: ['1st', '2nd', '3rd', '4th'],
      datasets: [{
          label: 'Weekly Total',
          data: chartData.data,
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderWidth: 1
      }]
  };

  chart = createChart(canvas, dataset);

  var text = `Monthly total amount is Php ${(chartData.total * 1000).toFixed(2)}`;
  canvas.parentElement.getElementsByTagName('span')[0].innerHTML = text;
}

function GenerateData() {
  var week1 = getRandomNum(10, 250);
  var week2 = getRandomNum(10, 250);
  var week3 = getRandomNum(10, 250);
  var week4 = getRandomNum(10, 250);

  var sum = week1 + week2 + week3 + week4;

  return {
      data: [week1, week2, week3, week4],
      total: sum
  };
}
//#endregion

//#endregion


//#region LOAN
var selectedLoanRow = null

function loanSubmitForm(e) {
  event.preventDefault();
  var formData = readLoanForm();
  if (selectedLoanRow == null) {
    insertNewLoanRecord(formData);
  }
  else {
    updateLoanRecord(formData);
  }
  resetLoanForm();

  //close modal on submission
  loanModal.style.display = 'none';
}

//Retrieve the data
function readLoanForm() {
  var formData = {};

  formData["loanClientSelector"] = document.getElementById("loanClientSelector").value;
  formData["loanLoanAmount"] = document.getElementById("loanLoanAmount").value;
  formData["loanLoanType"] = document.getElementById("loanLoanType").value;
  formData["loanLoanDate"] = document.getElementById("loanLoanDate").value;

  return formData;
}

function getClientNamesForLoan() {
  var select = document.getElementById("loanClientSelector");
  var table = document.getElementById("clientListForLoan");

  for (var i = 1; i < table.rows.length; i++) {
    var value = table.rows[i].cells[0].innerHTML;
    select.options[i] = new Option(value, value);
  }
}

function getCompanyForLoan(){
  var select = document.getElementById("loanClientSelector");
  var table = document.getElementById("clientListForLoan");

  return table.rows[select.selectedIndex].cells[1].innerHTML;
}

//Insert the data
function insertNewLoanRecord(data) {
  var table = document.getElementById("loanList").getElementsByTagName('tbody')[0];
  var newRow = table.insertRow(table.length);

  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.loanClientSelector;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = getCompanyForLoan();
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.loanLoanAmount
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = data.loanLoanType;
  cell5 = newRow.insertCell(4);
  cell5.innerHTML = data.loanLoanDate;
  cell6 = newRow.insertCell(5);
  cell6.innerHTML =
    `<button class="tdView" onClick="viewLoan(this)">&equiv;</button> 
  <button class="tdEdit" onClick="editLoan(this)">&minus;</button> 
  <button class="tdDelete" onClick="deleteLoan(this)">&times;</button>`;
}

// Edit the data
function editLoan(td) {
  selectedLoanRow = td.parentElement.parentElement;

  document.getElementById("loanModalHeaderText").innerHTML = "Edit Loan";

  document.getElementById("loanClientSelector").disabled = true;
  document.getElementById("loanClientSelector").value = selectedLoanRow.cells[0].innerHTML;
  document.getElementById("loanLoanAmount").readOnly = false;
  document.getElementById("loanLoanAmount").value = selectedLoanRow.cells[2].innerHTML;
  document.getElementById("loanLoanType").disabled = false;
  document.getElementById("loanLoanType").value = selectedLoanRow.cells[3].innerHTML;
  document.getElementById("loanLoanDate").readOnly = false;
  document.getElementById("loanLoanDate").value = selectedLoanRow.cells[4].innerHTML;

  document.getElementById("loanFormBtn").style.display = 'block';
  loanModal.style.display = 'block';
}

//view data
function viewLoan(td) {
  selectedLoanRow = td.parentElement.parentElement;

  document.getElementById("loanModalHeaderText").innerHTML = "View Loan";

  document.getElementById("loanClientSelector").disabled = true;
  document.getElementById("loanClientSelector").value = selectedLoanRow.cells[0].innerHTML;
  document.getElementById("loanLoanAmount").readOnly = true;
  document.getElementById("loanLoanAmount").value = selectedLoanRow.cells[2].innerHTML;
  document.getElementById("loanLoanType").disabled = true;
  document.getElementById("loanLoanType").value = selectedLoanRow.cells[3].innerHTML;
  document.getElementById("loanLoanDate").readOnly = true;
  document.getElementById("loanLoanDate").value = selectedLoanRow.cells[4].innerHTML;

  document.getElementById("loanFormBtn").style.display = 'none';
  loanModal.style.display = 'block';
}

function updateLoanRecord(formData) {
  selectedLoanRow.cells[0].innerHTML = formData.loanClientSelector;
  selectedLoanRow.cells[1].innerHTML = getCompanyForLoan();

  selectedLoanRow.cells[2].innerHTML = formData.loanLoanAmount;
  selectedLoanRow.cells[3].innerHTML = formData.loanLoanType;
  selectedLoanRow.cells[4].innerHTML = formData.loanLoanDate;
}

//Delete the data
function deleteLoan(td) {
  if (confirm('Do you want to delete this record?')) {
    row = td.parentElement.parentElement;
    document.getElementById('loanList').deleteRow(row.rowIndex);
    resetLoanForm();
  }
}

//Reset the data
function resetLoanForm() {
  document.getElementById("loanClientSelector").readOnly = true;
  document.getElementById("loanLoanAmount").value = "";
  document.getElementById("loanLoanType").value = "";
  document.getElementById("loanLoanDate").value = "";

  selectedLoanRow = null;
}

// Get DOM Elements
const loanModal = document.querySelector('#loanModalForm');
const loanModalBtn = document.querySelector('#loanModalBtn');
const closeLoanModal = document.querySelector('#closeLoanModalBtn');

// Events
loanModalBtn.addEventListener('click', openLoanModal);
closeLoanModal.addEventListener('click', closeLoanModalFunction);

// Open
function openLoanModal() {
  resetLoanForm();
  getClientNamesForLoan();

  document.getElementById("loanModalHeaderText").innerHTML = "Create Loan";

  document.getElementById("loanClientSelector").disabled = false;
  document.getElementById("loanLoanAmount").readOnly = false;
  document.getElementById("loanLoanType").disabled = false;
  document.getElementById("loanLoanDate").readOnly = false;

  document.getElementById("officer").value = "Nate";

  document.getElementById("loanFormBtn").style.display = 'block';
  loanModal.style.display = 'block';
}

// Close
function closeLoanModalFunction() {
  loanModal.style.display = 'none';
}
//#endregion

//#region PAYMENT
var selectedPaymentRow = null

function paymentSubmitForm(e) {
  event.preventDefault();
  var formData = readPaymentForm();
  if (selectedPaymentRow == null) {
    insertNewPaymentRecord(formData);
  }
  else {
    updatePaymentRecord(formData);
  }
  resetPaymentForm();

  //close modal on submission
  paymentModal.style.display = 'none';
}

//Retrieve the data
function readPaymentForm() {
  var formData = {};

  formData["paymentClientSelector"] = document.getElementById("paymentClientSelector").value;
  formData["paymentLoanAmount"] = document.getElementById("paymentLoanAmount").value;
  formData["paymentLoanDate"] = document.getElementById("paymentLoanDate").value;
  formData["paymentPaymentDate"] = document.getElementById("paymentPaymentDate").value;
  formData["paymentNumOfDays"] = document.getElementById("paymentNumOfDays").value;
  formData["paymentPayAmount"] = document.getElementById("paymentPayAmount").value;
  formData["paymentBalance"] = document.getElementById("paymentBalance").value;
  formData["paymentOfficer"] = document.getElementById("paymentOfficer").value;

  return formData;
}

function getClientNamesForPayment() {
  var select = document.getElementById("paymentClientSelector");
  var table = document.getElementById("loanListForPayment");

  for (var i = 1; i < table.rows.length; i++) {
    var value = table.rows[i].cells[0].innerHTML;
    select.options[i] = new Option(value, value);
  }
}

function getCompanyForPayment(){
  var select = document.getElementById("paymentClientSelector");
  var table = document.getElementById("loanListForPayment");

  return table.rows[select.selectedIndex].cells[3].innerHTML;
}

//Insert the data
function insertNewPaymentRecord(data) {
  var table = document.getElementById("paymentList").getElementsByTagName('tbody')[0];
  var newRow = table.insertRow(table.length);

  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.paymentClientSelector;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = getCompanyForPayment();

  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.paymentLoanAmount;
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = data.paymentLoanDate;
  cell5 = newRow.insertCell(4);
  cell5.innerHTML = data.paymentPaymentDate;
  cell6 = newRow.insertCell(5);
  cell6.innerHTML = data.paymentNumOfDays;
  cell7 = newRow.insertCell(6);
  cell7.innerHTML = data.paymentPayAmount;
  cell8 = newRow.insertCell(7);
  cell8.innerHTML = data.paymentBalance;
  cell9 = newRow.insertCell(8);
  cell9.innerHTML =
    `<button class="tdView" onClick="viewPayment(this)">&equiv;</button> 
  <button class="tdEdit" onClick="editPayment(this)">&minus;</button> 
  <button class="tdDelete" onClick="deletePayment(this)">&times;</button>`;
}

// Edit the data
function editPayment(td) {
  selectedPaymentRow = td.parentElement.parentElement;

  document.getElementById("paymentModalHeaderText").innerHTML = "Edit Payment";

  document.getElementById("paymentClientSelector").disabled = true;
  document.getElementById("paymentClientSelector").value = selectedPaymentRow.cells[0].innerHTML;
  document.getElementById("paymentLoanAmount").value = selectedPaymentRow.cells[2].innerHTML;
  document.getElementById("paymentLoanDate").value = selectedPaymentRow.cells[3].innerHTML;
  document.getElementById("paymentPaymentDate").readOnly = false;
  document.getElementById("paymentPaymentDate").value = selectedPaymentRow.cells[4].innerHTML;
  document.getElementById("paymentNumOfDays").value = selectedPaymentRow.cells[5].innerHTML;
  document.getElementById("paymentPayAmount").readOnly = false;
  document.getElementById("paymentPayAmount").value = selectedPaymentRow.cells[6].innerHTML;
  document.getElementById("paymentBalance").value = selectedPaymentRow.cells[7].innerHTML;
  document.getElementById("paymentOfficer").value = "Nate";

  document.getElementById("paymentFormBtn").style.display = 'block';
  paymentModal.style.display = 'block';
}

//view data
function viewPayment(td) {
  selectedPaymentRow = td.parentElement.parentElement;

  document.getElementById("paymentModalHeaderText").innerHTML = "View Payment";

  document.getElementById("paymentClientSelector").disabled = true;
  document.getElementById("paymentClientSelector").value = selectedPaymentRow.cells[0].innerHTML;
  document.getElementById("paymentLoanAmount").value = selectedPaymentRow.cells[2].innerHTML;
  document.getElementById("paymentLoanDate").value = selectedPaymentRow.cells[3].innerHTML;
  document.getElementById("paymentPaymentDate").readOnly = true;
  document.getElementById("paymentPaymentDate").value = selectedPaymentRow.cells[4].innerHTML;
  document.getElementById("paymentNumOfDays").value = selectedPaymentRow.cells[5].innerHTML;
  document.getElementById("paymentPayAmount").readOnly = true;
  document.getElementById("paymentPayAmount").value = selectedPaymentRow.cells[6].innerHTML;
  document.getElementById("paymentBalance").value = selectedPaymentRow.cells[7].innerHTML;
  document.getElementById("paymentOfficer").value = "Nate";

  document.getElementById("paymentFormBtn").style.display = 'block';

  document.getElementById("paymentFormBtn").style.display = 'none';
  paymentModal.style.display = 'block';
}

function updatePaymentRecord(formData) {

  selectedPaymentRow.cells[0].innerHTML = formData.paymentClientSelector;
  selectedPaymentRow.cells[2].innerHTML = formData.paymentLoanAmount;
  selectedPaymentRow.cells[3].innerHTML = formData.paymentLoanDate;
  selectedPaymentRow.cells[4].innerHTML = formData.paymentPaymentDate;
  selectedPaymentRow.cells[5].innerHTML = formData.paymentNumOfDays;
  selectedPaymentRow.cells[6].innerHTML = formData.paymentPayAmount;
  selectedPaymentRow.cells[7].innerHTML = formData.paymentBalance;
}

//Delete the data
function deletePayment(td) {
  if (confirm('Do you want to delete this record?')) {
    row = td.parentElement.parentElement;
    document.getElementById('paymentList').deleteRow(row.rowIndex);
    resetPaymentForm();
  }
}

//Reset the data
function resetPaymentForm() {
  document.getElementById("paymentPaymentDate").value = "";
  document.getElementById("paymentNumOfDays").value = "";
  document.getElementById("paymentPayAmount").value = "";
  document.getElementById("paymentBalance").value = "";

  selectedPaymentRow = null;
}

// Get DOM Elements
const paymentModal = document.querySelector('#paymentModalForm');
const paymentModalBtn = document.querySelector('#paymentModalBtn');
const paymentCloseBtn = document.querySelector('#closePaymentModalBtn');

// Events
paymentModalBtn.addEventListener('click', openPaymentModal);
paymentCloseBtn.addEventListener('click', closePaymentModal);

// Open
function openPaymentModal() {
  resetPaymentForm();
  getClientNamesForPayment();

  document.getElementById("paymentModalHeaderText").innerHTML = "Create Payment";

  document.getElementById("paymentClientSelector").disabled = false;

  document.getElementById("paymentOfficer").value = "Nate";
  
  paymentModal.style.display = 'block';
}

// Close
function closePaymentModal() {
  paymentModal.style.display = 'none';
}

function getLoanDetailsForPayment() {
  var select = document.getElementById("paymentClientSelector");
  var table = document.getElementById("loanListForPayment");

  var index = select.selectedIndex;

  paymentLoanDate = new Date(Date.parse(table.rows[index].cells[2].innerHTML)).toLocaleDateString();;

  console.log(paymentLoanDate);

  document.getElementById("paymentLoanAmount").value = table.rows[index].cells[1].innerHTML;
  document.getElementById("paymentLoanDate").value = paymentLoanDate;
}

function getNumOfDays(date1, date2) {
  //calculate time difference  
  var timeDiff = date2.getTime() - date1.getTime();  
  
  //calculate days difference by dividing total milliseconds in a day  
  var dayDiff = timeDiff / (1000 * 60 * 60 * 24);  

  return parseInt(dayDiff);
}

function computeDaysAndBalance() {

  var paymentLoanDate = document.getElementById("paymentLoanDate").value;
  var payDate = document.getElementById("paymentPaymentDate").value;

  var loanParse = new Date(Date.parse(paymentLoanDate));
  var payParse = new Date(Date.parse(payDate));

  var paymentNumOfDays = getNumOfDays(loanParse,payParse);

  document.getElementById("paymentNumOfDays").value = paymentNumOfDays;

  var paymentLoanAmount = parseInt(document.getElementById("paymentLoanAmount").value);
  
  var paymentBalance = ((((paymentLoanAmount*0.05)/30)*paymentNumOfDays)+paymentLoanAmount).toFixed(2);

  document.getElementById("paymentBalance").value = paymentBalance;
}

function updateBalance(paidAmount){
  var paymentBalance = document.getElementById("paymentBalance").value;
  var remainingBalance = (paymentBalance - paidAmount).toFixed(2);

  document.getElementById("paymentBalance").value = remainingBalance;
}
//#endregion

//#region CLIENT
var selectedClientRow = null

function clientSubmitForm(e) {
  event.preventDefault();
  var formData = readClientForm();
  if (selectedClientRow == null) {
    insertClientRecord(formData);
  }
  else {
    updateClientRecord(formData);
  }
  resetClientForm();

  //close modal on submission
  clientModal.style.display = 'none';
}

//Retrieve the data
function readClientForm() {
  var formData = {};

  formData["clientLname"] = document.getElementById("clientLname").value;
  formData["clientMname"] = document.getElementById("clientMname").value;
  formData["clientFname"] = document.getElementById("clientFname").value;
  formData["clientGender"] = document.getElementById("clientGender").value;
  formData["clientBday"] = document.getElementById("clientBday").value;
  formData["clientContactNum"] = document.getElementById("clientContactNum").value;
  formData["clientAddress"] = document.getElementById("clientAddress").value;
  formData["clientCompany"] = document.getElementById("clientCompany").value;
  formData["clientCompanyAdress"] = document.getElementById("clientCompanyAdress").value;
  formData["clientCompanyContact"] = document.getElementById("clientCompanyContact").value;
  formData["clientPosition"] = document.getElementById("clientPosition").value;
  formData["clientIncome"] = document.getElementById("clientIncome").value;
  
  return formData;
}

//Insert the data
function insertClientRecord(data) {
  var table = document.getElementById("clientList").getElementsByTagName('tbody')[0];
  var newRow = table.insertRow(table.length);
  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.clientLname;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.clientMname;
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.clientFname;

  cell4 = newRow.insertCell(3); // full name

  var fullName = `${data.clientFname} ${data.clientMname.charAt(0)}. ${data.clientLname}`;
  cell4.innerHTML = fullName;

  cell5 = newRow.insertCell(4);
  cell5.innerHTML = data.clientGender;
  cell6 = newRow.insertCell(5);
  cell6.innerHTML = data.clientBday;
  cell7 = newRow.insertCell(6);
  cell7.innerHTML = data.clientContactNum;
  cell8 = newRow.insertCell(7);
  cell8.innerHTML = data.clientAddress;
  cell9 = newRow.insertCell(8);
  cell9.innerHTML = data.clientCompany;
  cell10 = newRow.insertCell(9);
  cell10.innerHTML = data.clientCompanyAdress;
  cell11 = newRow.insertCell(10);
  cell11.innerHTML = data.clientCompanyContact;
  cell12 = newRow.insertCell(11);
  cell12.innerHTML = data.clientCompanyAdress;
  cell13 = newRow.insertCell(12);
  cell13.innerHTML = data.clientPosition;
  cell14 = newRow.insertCell(13);
  cell14.innerHTML = data.clientIncome;

  cell15 = newRow.insertCell(14);
  // add button here to edit
  cell15.innerHTML = 
  `<button class="tdView" onClick="viewClient(this)">&equiv;</button> 
  <button class="tdEdit" onClick="editClient(this)">&minus;</button> 
  <button class="tdDelete" onClick="deleteClient(this)">&times;</button>`;
}

// Edit the data
function editClient(td) {
  selectedClientRow = td.parentElement.parentElement;

  document.getElementById("clientModalHeaderText").innerHTML = "Edit Client";

  document.getElementById('clientLname').readOnly = false;
  document.getElementById("clientLname").value = selectedClientRow.cells[0].innerHTML;
  document.getElementById('clientMname').readOnly = false;
  document.getElementById("clientMname").value = selectedClientRow.cells[1].innerHTML;
  document.getElementById('clientFname').readOnly = false;
  document.getElementById("clientFname").value = selectedClientRow.cells[2].innerHTML;
  //full name
  document.getElementById('clientGender').disabled = false;
  document.getElementById("clientGender").value = selectedClientRow.cells[4].innerHTML;
  document.getElementById('clientBday').readOnly = false;
  document.getElementById("clientBday").value = selectedClientRow.cells[5].innerHTML;
  document.getElementById('clientContactNum').readOnly = false;
  document.getElementById("clientContactNum").value = selectedClientRow.cells[6].innerHTML;
  document.getElementById('clientAddress').readOnly = false;
  document.getElementById("clientAddress").value = selectedClientRow.cells[7].innerHTML;
  document.getElementById('clientCompany').readOnly = false;
  document.getElementById("clientCompany").value = selectedClientRow.cells[8].innerHTML;
  document.getElementById('clientCompanyAdress').readOnly = false;
  document.getElementById("clientCompanyAdress").value = selectedClientRow.cells[9].innerHTML;
  document.getElementById('clientCompanyContact').readOnly = false;
  document.getElementById("clientCompanyContact").value = selectedClientRow.cells[10].innerHTML;
  document.getElementById('clientPosition').readOnly = false;
  document.getElementById("clientPosition").value = selectedClientRow.cells[11].innerHTML;
  document.getElementById('clientIncome').readOnly = false;
  document.getElementById("clientIncome").value = selectedClientRow.cells[12].innerHTML;

  document.getElementById("clientFormBtn").style.display = 'block';

  clientModal.style.display = 'block';
}

//view data
function viewClient(td){
  selectedClientRow = td.parentElement.parentElement;

  document.getElementById("clientModalHeaderText").innerHTML = "View Client";

  document.getElementById('clientLname').readOnly = true;
  document.getElementById("clientLname").value = selectedClientRow.cells[0].innerHTML;
  document.getElementById('clientMname').readOnly = true;
  document.getElementById("clientMname").value = selectedClientRow.cells[1].innerHTML;
  document.getElementById('clientFname').readOnly = true;
  document.getElementById("clientFname").value = selectedClientRow.cells[2].innerHTML;
  //full name
  document.getElementById('clientGender').disabled = true;
  document.getElementById("clientGender").value = selectedClientRow.cells[4].innerHTML;
  document.getElementById('clientBday').readOnly = true;
  document.getElementById("clientBday").value = selectedClientRow.cells[5].innerHTML;
  document.getElementById('clientContactNum').readOnly = true;
  document.getElementById("clientContactNum").value = selectedClientRow.cells[6].innerHTML;
  document.getElementById('clientAddress').readOnly = true;
  document.getElementById("clientAddress").value = selectedClientRow.cells[7].innerHTML;
  document.getElementById('clientCompany').readOnly = true;
  document.getElementById("clientCompany").value = selectedClientRow.cells[8].innerHTML;
  document.getElementById('clientCompanyAdress').readOnly = true;
  document.getElementById("clientCompanyAdress").value = selectedClientRow.cells[9].innerHTML;
  document.getElementById('clientCompanyContact').readOnly = true;
  document.getElementById("clientCompanyContact").value = selectedClientRow.cells[10].innerHTML;
  document.getElementById('clientPosition').readOnly = true;
  document.getElementById("clientPosition").value = selectedClientRow.cells[11].innerHTML;
  document.getElementById('clientIncome').readOnly = true;
  document.getElementById("clientIncome").value = selectedClientRow.cells[12].innerHTML;

  document.getElementById("clientFormBtn").style.display = 'none';
  clientModal.style.display = 'block';
}

function updateClientRecord(formData) {
  selectedClientRow.cells[0].innerHTML = formData.clientLname;
  selectedClientRow.cells[1].innerHTML = formData.clientMname;
  selectedClientRow.cells[2].innerHTML = formData.clientFname;

  var fullName = `${formData.clientFname} ${formData.clientMname.charAt(0)}. ${formData.clientLname}`;

  selectedClientRow.cells[3].innerHTML = fullName;
  selectedClientRow.cells[4].innerHTML = formData.clientGender;
  selectedClientRow.cells[5].innerHTML = formData.clientBday;
  selectedClientRow.cells[6].innerHTML = formData.clientContactNum;
  selectedClientRow.cells[7].innerHTML = formData.clientAddress;
  selectedClientRow.cells[8].innerHTML = formData.clientCompany;
  selectedClientRow.cells[9].innerHTML = formData.clientCompanyAdress;
  selectedClientRow.cells[10].innerHTML = formData.clientCompanyContact;
  selectedClientRow.cells[11].innerHTML = formData.clientPosition;
  selectedClientRow.cells[12].innerHTML = formData.clientIncome;
}

//Delete the data
function deleteClient(td) {
  if (confirm('Do you want to delete this record?')) {
    row = td.parentElement.parentElement;
    document.getElementById('clientList').deleteRow(row.rowIndex);
    resetClientForm();
  }
}

//Reset the data
function resetClientForm() {
  document.getElementById("clientLname").value = '';
  document.getElementById("clientMname").value = '';
  document.getElementById("clientFname").value = '';
  document.getElementById("clientGender").value = '';
  document.getElementById("clientBday").value = '';
  document.getElementById("clientContactNum").value = '';
  document.getElementById("clientAddress").value = '';

  document.getElementById("clientCompany").value = '';
  document.getElementById("clientCompanyAdress").value = '';
  document.getElementById("clientCompanyContact").value = '';
  document.getElementById("clientPosition").value = '';
  document.getElementById("clientIncome").value = '';

  selectedClientRow = null;
}

// Get DOM Elements
const clientModal = document.querySelector('#clientModalForm');
const clientModalBtn = document.querySelector('#clientModalBtn');
const clientCloseBtn = document.querySelector('#closeClientBtnModalForm');

// Events
clientModalBtn.addEventListener('click', openClientModal);
clientCloseBtn.addEventListener('click', closeClientModal);
// window.addEventListener('click', outsideClick);

// Open
function openClientModal() {
  resetClientForm();

  document.getElementById("clientModalHeaderText").innerHTML = "Create Client";

  document.getElementById('clientLname').readOnly = false;
  document.getElementById('clientMname').readOnly = false;
  document.getElementById('clientFname').readOnly = false;
  document.getElementById('clientGender').disabled = false;
  document.getElementById('clientBday').readOnly = false;
  document.getElementById('clientContactNum').readOnly = false;
  document.getElementById('clientAddress').readOnly = false;
  document.getElementById('clientCompany').readOnly = false;
  document.getElementById('clientCompanyAdress').readOnly = false;
  document.getElementById('clientCompanyContact').readOnly = false;
  document.getElementById('clientPosition').readOnly = false;
  document.getElementById('clientIncome').readOnly = false;

  document.getElementById("clientFormBtn").style.display = 'block';
  clientModal.style.display = 'block';
}

// Close
function closeClientModal() {
  clientModal.style.display = 'none';
}

//#endregion

//#region USER
var selectUserRow = null

function userSubmitForm(e) {
  event.preventDefault();
  var formData = readUserForm();
  if (selectUserRow == null) {
    insertUserRecord(formData);
  }
  else {
    updateUserRecord(formData);
  }
  resetUserForm();

  //close modal on submission
  userModal.style.display = 'none';
}

//Retrieve the data
function readUserForm() {
  var formData = {};

  formData["userUserName"] = document.getElementById("userUserName").value;
  formData["userPassword"] = document.getElementById("userPassword").value;
  formData["userLname"] = document.getElementById("userLname").value;
  formData["userMname"] = document.getElementById("userMname").value;
  formData["userFname"] = document.getElementById("userFname").value;
  formData["userGender"] = document.getElementById("userGender").value;
  formData["userBday"] = document.getElementById("userBday").value;
  formData["userContactNum"] = document.getElementById("userContactNum").value;
  formData["userAddress"] = document.getElementById("userAddress").value;
  formData["userPosition"] = document.getElementById("userPosition").value;
  formData["userRole"] = document.getElementById("userRole").value;

  return formData;
}

//Insert the data
function insertUserRecord(data) {
  var table = document.getElementById("userList").getElementsByTagName('tbody')[0];
  var newRow = table.insertRow(table.length);
  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.userUserName;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.userPassword;
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.userLname
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = data.userMname;
  cell5 = newRow.insertCell(4);
  cell5.innerHTML = data.userFname;

  cell6 = newRow.insertCell(5);
  var fuluserLname = `${data.userFname} ${data.userMname.charAt(0)}. ${data.userLname}`;
  cell6.innerHTML = fuluserLname;

  cell7 = newRow.insertCell(6);
  cell7.innerHTML = data.userGender;
  cell8 = newRow.insertCell(7);
  cell8.innerHTML = data.userBday;
  cell9 = newRow.insertCell(8);
  cell9.innerHTML = data.userContactNum;
  cell10 = newRow.insertCell(9);
  cell10.innerHTML = data.userAddress;
  cell11 = newRow.insertCell(10);
  cell11.innerHTML = data.userPosition;
  cell12 = newRow.insertCell(11);
  cell12.innerHTML = data.userRole;
  cell13 = newRow.insertCell(12);
  cell13.innerHTML = 
  `<button class="tdView" onClick="viewUserRow(this)">&equiv;</button> 
  <button class="tdEdit" onClick="editUserRow(this)">&minus;</button> 
  <button class="tdDelete" onClick="deleteUserRow(this)">&times;</button>`;
}

// Edit the data
function editUserRow(td) {
  selectUserRow = td.parentElement.parentElement;

  document.getElementById("userModalHeader").innerHTML = "Edit User";

  document.getElementById('userUserName').readOnly = false;
  document.getElementById("userUserName").value = selectUserRow.cells[0].innerHTML;
  document.getElementById('userPassword').readOnly = false;
  document.getElementById("userPassword").value = selectUserRow.cells[1].innerHTML;
  document.getElementById('userLname').readOnly = false;
  document.getElementById("userLname").value = selectUserRow.cells[2].innerHTML;
  document.getElementById('userMname').readOnly = false;
  document.getElementById("userMname").value = selectUserRow.cells[3].innerHTML;
  document.getElementById('userFname').readOnly = false;
  document.getElementById("userFname").value = selectUserRow.cells[4].innerHTML;
  document.getElementById('userGender').disabled = false;
  document.getElementById("userGender").value = selectUserRow.cells[6].innerHTML;
  document.getElementById('userBday').readOnly = false;
  document.getElementById("userBday").value = selectUserRow.cells[7].innerHTML;
  document.getElementById('userContactNum').readOnly = false;
  document.getElementById("userContactNum").value = selectUserRow.cells[8].innerHTML;
  document.getElementById('userAddress').readOnly = false;
  document.getElementById("userAddress").value = selectUserRow.cells[9].innerHTML;
  document.getElementById('userPosition').readOnly = false;
  document.getElementById("userPosition").value = selectUserRow.cells[10].innerHTML;
  document.getElementById('userRole').readOnly = false;
  document.getElementById("userRole").value = selectUserRow.cells[11].innerHTML;

  document.getElementById("userFormBtn").style.display = 'block';

  userModal.style.display = 'block';
}

//view data
function viewUserRow(td){
  selectUserRow = td.parentElement.parentElement;

  document.getElementById("userModalHeader").innerHTML = "View User";

  document.getElementById('userUserName').readOnly = true;
  document.getElementById("userUserName").value = selectUserRow.cells[0].innerHTML;
  document.getElementById('userPassword').readOnly = true;
  document.getElementById("userPassword").value = selectUserRow.cells[1].innerHTML;
  document.getElementById('userLname').readOnly = true;
  document.getElementById("userLname").value = selectUserRow.cells[2].innerHTML;
  document.getElementById('userMname').readOnly = true;
  document.getElementById("userMname").value = selectUserRow.cells[3].innerHTML;
  document.getElementById('userFname').readOnly = true;
  document.getElementById("userFname").value = selectUserRow.cells[4].innerHTML;
  document.getElementById('userGender').disabled = true;
  document.getElementById("userGender").value = selectUserRow.cells[6].innerHTML;
  document.getElementById('userBday').readOnly = true;
  document.getElementById("userBday").value = selectUserRow.cells[7].innerHTML;
  document.getElementById('userContactNum').readOnly = true;
  document.getElementById("userContactNum").value = selectUserRow.cells[8].innerHTML;
  document.getElementById('userAddress').readOnly = true;
  document.getElementById("userAddress").value = selectUserRow.cells[9].innerHTML;
  document.getElementById('userPosition').readOnly = true;
  document.getElementById("userPosition").value = selectUserRow.cells[10].innerHTML;
  document.getElementById('userRole').readOnly = true;
  document.getElementById("userRole").value = selectUserRow.cells[11].innerHTML;

  document.getElementById("userFormBtn").style.display = 'none';
  userModal.style.display = 'block';
}

function updateUserRecord(formData) {
  selectUserRow.cells[0].innerHTML = formData.userUserName;
  selectUserRow.cells[1].innerHTML = formData.userPassword;

  selectUserRow.cells[2].innerHTML = formData.userLname;
  selectUserRow.cells[3].innerHTML = formData.userMname;
  selectUserRow.cells[4].innerHTML = formData.userFname;

  var fuluserLname = `${formData.userFname} ${formData.userMname.charAt(0)}. ${formData.userLname}`;
  selectUserRow.cells[5].innerHTML = fuluserLname;
  selectUserRow.cells[6].innerHTML = formData.userGender;
  selectUserRow.cells[7].innerHTML = formData.userBday;
  selectUserRow.cells[8].innerHTML = formData.userContactNum;
  selectUserRow.cells[9].innerHTML = formData.userAddress;
  selectUserRow.cells[10].innerHTML = formData.userPosition;
  selectUserRow.cells[11].innerHTML = formData.userRole;
}

//Delete the data
function deleteUserRow(td) {
  if (confirm('Do you want to delete this record?')) {
    row = td.parentElement.parentElement;
    document.getElementById('userList').deleteRow(row.rowIndex);
    resetUserForm();
  }
}

//Reset the data
function resetUserForm() {
  document.getElementById('userUserName').value = '';
  document.getElementById('userPassword').value = '';
  document.getElementById('userLname').value = '';
  document.getElementById('userMname').value = '';
  document.getElementById('userFname').value = '';
  document.getElementById('userGender').value = '';
  document.getElementById('userBday').value = '';
  document.getElementById('userContactNum').value = '';
  document.getElementById('userAddress').value = '';
  document.getElementById('userPosition').value = '';
  document.getElementById('userRole').value = '';

  selectUserRow = null;
}

// Get DOM Elements
const userModal = document.querySelector('#userModal');
const userModalBtn = document.querySelector('#userBtnModal');
const userCloseBtn = document.querySelector('#closeUserModalBtn');

// Events
userModalBtn.addEventListener('click', openUserModal);
userCloseBtn.addEventListener('click', closeUserModal);

// Open
function openUserModal() {
  resetUserForm();

  document.getElementById("userModalHeader").innerHTML = "Create User";

  document.getElementById('userUserName').readOnly = false;
  document.getElementById('userPassword').readOnly = false;
  document.getElementById('userLname').readOnly = false;
  document.getElementById('userMname').readOnly = false;
  document.getElementById('userFname').readOnly = false;
  document.getElementById('userGender').disabled = false;
  document.getElementById('userBday').readOnly = false;
  document.getElementById('userContactNum').readOnly = false;
  document.getElementById('userAddress').readOnly = false;
  document.getElementById('userPosition').readOnly = false;
  document.getElementById('userRole').readOnly = false;

  document.getElementById("userFormBtn").style.display = 'block';
  userModal.style.display = 'block';
}

// Close
function closeUserModal() {
  userModal.style.display = 'none';
}

//#endregion