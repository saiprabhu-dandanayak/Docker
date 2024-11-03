
//this is script.js file 
//this file stores the tables in the local storage and updates the data accordingly
var tableId = document.getElementById("tables");
var menuId = document.getElementById("menu-items");


//store the tables objects in local storage with key as tables
function initialize_app() {
  if (localStorage.getItem("tables") == null) {
    localStorage.setItem("tables", JSON.stringify(tables));  // can't store object directly into the local storage so convert it to json string
  }
  showTables();
  showMenu();
}

function createTable(id, cost, items) {
  let table = `<li ondrop="drop(event,'table${id}')"  id="table${id}" ondragover="handleDrop(event)" onclick="openmodal('table${id}'); changeTableColor('table${id}')">
        <h2>Table-${id}</h2>
        <p>Rs ${cost} | Total items: ${items}</p>
        </li>`;
  return table;
}

function showTables() {
  let i = 1;
  let tables = JSON.parse(localStorage.getItem("tables")); //converts json string to javascript object
  // console.log(tables);
  tableId.innerHTML = "";
  while (tables["table" + i] != null) {
      // console.log(tables['table'+i])
    let { cost, items } = tables["table" + i];

    let table = createTable(i, cost, items);
    tableId.insertAdjacentHTML("beforeend", table);  //inserts at the last of tableId
    i++;
  }
}



function createMenuItem(i, name, cost,category) {
  let item = `<li id="item${i}" draggable="true" ondragstart="drag(event)">
        <h2>${name}</h2> 
        <p>${category}</p>        
        <p>${cost}.00</p>  </li> `;
  return item;
}



function showMenu() {
  let i = 1;
  menuId.innerHTML = "";
  while (menu["item" + i] != null) {
    // console.log('item'+i)
    //de-structing of menu object
    let { name, cost,category} = menu["item" + i];
    let item = createMenuItem(i, name, cost,category);
    menuId.insertAdjacentHTML("beforeend", item);
    i++;
  }
}
// function changeTableColor(tableId) {
//   var table = document.getElementById(tableId);
//   table.style.backgroundColor = 'yellow';
// }


var previouslyClickedTableId = null;

function changeTableColor(tableId) {
  if (previouslyClickedTableId !== null) {
    var previousTable = document.getElementById(previouslyClickedTableId);
    previousTable.style.backgroundColor = '';
  }

  var table = document.getElementById(tableId);
  table.style.backgroundColor = 'orange';

  previouslyClickedTableId = tableId;
}



function searchTable() {
  let searchKey = document.getElementById("table-search").value;
  let tables = JSON.parse(localStorage.getItem("tables"));
  searchKey = searchKey.toLowerCase();  // this is done for case-insensitivity
  let table = Object.keys(tables);   //it will retrive all the keys from the table object 
  let n = table.length;
  tableId.innerHTML = "";
  searchKey = searchKey.split("-").join("");

  for (i = 0; i < n; i++) {
    if (table[i].includes(searchKey)) {
      let id = i + 1;
      let { cost, items } = tables["table" + id];
      let tableSearched = createTable(id, cost, items);
      tableId.insertAdjacentHTML("beforeend", tableSearched);
    }
  }

}

function searchMenu() {
  let searchKey = document.getElementById("menu-search").value;
  searchKey = searchKey.toLowerCase();

  let i = 1;
  menuId.innerHTML = "";
  while (menu["item" + i] != null) {
    let { name, cost,category } = menu["item" + i];
    let itemName = name.toLowerCase();
    let categoryname=category.toLowerCase();
    if (itemName.includes(searchKey) || categoryname.includes(searchKey)) {
      let item = createMenuItem(i, name, cost,category);
      menuId.insertAdjacentHTML("beforeend", item);
    }
    i++;
  }
}

var modal = document.getElementById("myModal");

//Modal close
function closemodal() {
  // body.style.filter='';
  modal.style.display = "none";  
  // let table = document.querySelector("li.blur");
  
  table.classList.add("blur");
  if (previouslyClickedTableId !== null) {
    var previousTable = document.getElementById(previouslyClickedTableId);
    previousTable.style.backgroundColor = null;
    previouslyClickedTableId = null;
  }

}

  function openmodal(tablename) {
    // const body = document.querySelector('body');
    // const modal = document.querySelector('.modal');
    // body.style.filter = 'blur(0px)';
    modal.style.display = "block";

    // modal.addEventListener('click', function(e) {
    //   if(e.target.classList.contains('modal')) {
    //     closeModal();
    //   }
    // });
    
    // const body = document.querySelector('body');
      //  const modal = document.querySelector('.modal');
      //  body.classList.add('modal-open');
  //     const body = document.querySelector('body');
    // modal.style.display = "block";
  //   body.classList.add('modal-open');
  //   let table1 = document.getElementById(tablename);
  // table1.style.filter = "blur(4px)";
    // table.classList.remove("blur");
    // let table2 = document.getElementById(tablename);
    // table2.style.filter = "blur(4px)";
    // table.style.filter = "";
    // document.body.style.opacity=1
    document.getElementById("modal-header").innerHTML = `
    <h4>${tablename.toUpperCase()} ------> Order Details <span class="close"  onclick="closemodal()">&times;</span>
    </h4>`;
    
    // modal.setAttribute('draggable',true);
    let rows = document.getElementById("rows");
    rows.innerHTML = `<tr><th>S.No</th>
    <th>Item</th>
    <th>Price</th>
    <th>no of servings</th> 
    <th> Total price</th>
    <th> delete item</th>
    </tr>`;
    
    let tables = JSON.parse(localStorage.getItem("tables"));
    let table = tables[tablename];
    let { cost, orders } = table;
    let i = 1;
    console.log(Object.entries(orders))
    for (let [item, qty] of Object.entries(orders)) {
      console.log(item,qty)
      rows.insertAdjacentHTML("beforeend",
      `<tr>
			<td>${i}.</td> 
      <td>${menu[item].name}</td>
      <td>${menu[item].cost}</td>
      <td><input type="number" id="qty${i}" name="quantity" size="2" min=1  max=10 value= ${qty}  oninput="changeQty('${i}','${item}','${tablename}')"></td>
      <td>${menu[item].cost * qty}</td>
      <td><i id="delete" class="fas fa-trash-alt fa-fw"  onclick="deleteitem('${item}','${tablename}')"></i></td>
      </tr>
      `
      );
      
      i++;
     
    }
    let total = document.getElementById("total");
    total.innerHTML = `TOTAL: ${cost}`;
    document.getElementById('modal-footer').innerHTML=`<h4  onclick="generate_bill('${tablename}'); greet('${cost}')">  CLOSE SESSION (GENERATE BILL) </h4>`
    
}


function changeQty(i, itemId, tableNo) {
  let tables = JSON.parse(localStorage.getItem("tables"));
  let table = tables[tableNo];
  let qty = document.getElementById(`qty${i}`).value;
  table.orders[itemId] = parseInt(qty);
  let items = 0;
  let total = 0;
  for (let [item, qty] of Object.entries(table.orders)) {
    items += qty;
    total += menu[item].cost * qty;
  }
  table.items = items;
  table.cost = total;
  localStorage.setItem("tables", JSON.stringify(tables));
  showTables();
  openmodal(tableNo);
}



function greet(cost){
  alert(`THANKYOU FOR PAYING ${cost} , VISIT AGAIN 😊`)
}

function generate_bill(tablename){
    let tables = JSON.parse(localStorage.getItem("tables"));
    tables[tablename].orders = {};
    tables[tablename].cost = 0;
    tables[tablename].items=0;
    localStorage.setItem("tables", JSON.stringify(tables));
    
    let rows = document.getElementById("rows");
    rows.innerHTML = "";
    let total = document.getElementById("total");
    total.innerHTML = "TOTAL: 0";
    showTables();
    closemodal();
  }
  



function deleteitem(item,tableNo)
{
  let tables = JSON.parse(localStorage.getItem("tables"));
  let table = tables[tableNo];
  let itemCost = menu[item].cost;
  let itemQty = table.orders[item];

  delete table.orders[item];

  table.cost -= itemCost * itemQty;
  table.items -= itemQty;
  tables[tableNo] = table;
  localStorage.setItem("tables", JSON.stringify(tables));
  showTables();
  openmodal(tableNo);
  
}

// data will be transfered during the drag operation....
function drag(e) {
  e.dataTransfer.setData("id", e.target.id);
  console.log(e.target.id);
}

// by default the browser doesnot support the drop operation , so we will prevent it
function handleDrop(e) {
  e.preventDefault();
}


function drop(e, tableName) {
  console.log(tableName);
  // add item and price 
  addItemToTable(tableName, e.dataTransfer.getData("id"));
  // console.log(e.dataTransfer.getData("id"))
}

function addItemToTable(tableName, itemId) {
  let tables = JSON.parse(localStorage.getItem("tables"));
  let item = menu[itemId];
  // console.log(item);

  if (tables[tableName]["orders"][itemId] == undefined) {
    tables[tableName]["orders"][itemId] = 1;
  } else {
    tables[tableName]["orders"][itemId] += 1;
  }
  tables[tableName].cost += parseInt(item.cost);
  tables[tableName]["items"] += 1;
  localStorage.setItem("tables", JSON.stringify(tables));
  showTables();
}
