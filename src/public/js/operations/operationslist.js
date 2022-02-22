let queryOpSelected="?type=all"
function AJAXgetDataList(query){
    return new Promise((resolve,reject)=>{
        const http= new XMLHttpRequest()
        const amountOpsToShow=10 //Sets how many operations wants to show
        const apiURL = "http://localhost:3000/operations/"+query+"&amount="+amountOpsToShow
    
        http.onreadystatechange= function(){
            if(this.readyState == 4 && this.status ==200){
                let data=JSON.parse(this.responseText)
                const storage= window.localStorage //I Use this to get if need show successfull message
                const status=storage.getItem("status")
                if(status!=undefined){
                    makeMessage(status)
                }
                resolve(data)
            }
        }
        http.open("GET", apiURL)
        http.send()
    })
}

function AJAXgetTotalBalance(){
    return new Promise((resolve,reject)=>{
        const http= new XMLHttpRequest()
        const apiURL = "http://localhost:3000/operations/totalBalance"
    
        http.onreadystatechange= function(){
            if(this.readyState == 4 && this.status ==200){
                let data=JSON.parse(this.responseText)
                resolve(data)
            }
        }
        http.open("GET", apiURL)
        http.send()
    })
}

function renderTable(data){
    let table = document.getElementsByClassName("table")[0]
    //Creates and set the head of table as dark
    let thead= document.createElement("thead")
    table.appendChild(thead)
    let tr= document.createElement("tr")
    tr.className="table-dark tableHeader"
    thead.appendChild(tr)
    let columns=["Id", "Concept", "Amount", "Date", "Type",""]
    let th
    columns.forEach(colName => {
        th= document.createElement("th")
        th.scope="col"
        th.textContent=colName
        tr.appendChild(th)
    })

    //Creates select type bar
    let select=document.createElement("select")
    select.className="selectType"
    th.appendChild(select)
    let option
    let options=["All operations","Entrys", "Expenses"]
    options.forEach(op => {
        option=document.createElement("option")
        option.textContent=op
        select.appendChild(option)
    });
    selectEvent()//Creates an eventListener for changes in type selected to show
    renderOperations(data,table)//I divide the method than create the table for readability beacuse its to long
}

async function renderOperations(data,table){//creates rows (each operation) of table 
    let tbody
    let td
    //Print rows
    data.forEach(row => {
        tbody= document.createElement("tbody")
        table.appendChild(tbody)
        //Sets background color
        tr= document.createElement("tr")
        tr.className=colorType(row.type)
        tbody.appendChild(tr)

        //Print row data except user_id
        row["date"]=formatDate(row.date)
        rowData= Object.assign({},row) //to not loose user_id, just in case I need it in future
        delete rowData.user_id //to not print user_id
        for(let prop in rowData){
            td= document.createElement("td")
            td.textContent=row[prop]
            if(prop=="amount"){
                td.textContent="$"+td.textContent
            }
            tr.appendChild(td)
        }

        //Print buttons of operations
        td= document.createElement("td")
        
        //Creates a href than works like button
        tr.appendChild(td)
        btnEdit= document.createElement("a")
        btnEdit.href= "http://localhost:3000/edit.html?editId="+row.id //adds the id of the operation
        btnEdit.className= "btn btn-secondary btnEdit ms-1 me-1"
        td.appendChild(btnEdit)
        imageButton= document.createElement("i")
        imageButton.className= "fas fa-edit"
        btnEdit.appendChild(imageButton)
       

        //Creates a button to take ventage of ajax request instead refresh the page
        tr.appendChild(td)
        btnDelete= document.createElement("button")
        btnDelete.id= "btnDelete-"+row.id //adds the id of the operation
        btnDelete.className= "btn btn-danger btnDelete ms-1 me-1"
        td.appendChild(btnDelete)
        imageButton= document.createElement("i")
        imageButton.className= "fas fa-trash-alt"
        btnDelete.appendChild(imageButton)
        deleteButtonEvent(btnDelete)
    })

    //Print row of actual balance
    tbody= document.createElement("tbody")
    table.appendChild(tbody)
    
    tr= document.createElement("tr")
    tr.className="balance"
    tbody.appendChild(tr)
    for (let i = 0; i < Object.keys(data[0]).length -1; i++) {
        td= document.createElement("td")
        tr.appendChild(td)
    }
    td= document.createElement("td")
    let balance= await AJAXgetTotalBalance()
    td.textContent="TOTAL BALANCE: $"+balance[0].finalBalance
    tr.appendChild(td)
}


function renderNotOperations(){
    let col = document.getElementsByClassName("col")[0]
    let divCol= document.createElement("div")
    divCol.className="col-md-4 mx-auto"
    col.appendChild(divCol)
    
    let divCard= document.createElement("div")
    divCard.className="card card-body text-center"
    divCol.appendChild(divCard)

    let pText= document.createElement("p")
    pText.textContent="There are not operations saved yet."
    divCard.appendChild(pText)

    let createOneOp= document.createElement("a")
    createOneOp.href="http://localhost:3000/add.html"
    createOneOp.textContent="Create One!"
    divCard.appendChild(createOneOp)
}

function makeMessage(status){
    let messageContainer= document.getElementsByClassName("messageContainer")[0]
    let alert= document.createElement("div")
    alert.className="alert alert-success alert-dismissible fade show"
    alert.setAttribute("role","alert")
    messageContainer.appendChild(alert)

    //Set the message text according to status number
    let text=""
    switch(status){
        case "1"://Comes from doing an add operation
            alert.className+=" alert-success" //Sets the background color
            text="Operation saved successfully"
            break
        case "2"://Comes from doing an edit operation
            alert.className+=" alert-success" //Sets the background color
            text="Operation edited successfully"
            break
        case "3":
            alert.className+=" alert-danger" //Sets the background color
            text="Operation removed successfully"
            break
    }
    const storage= window.localStorage
    storage.removeItem("status")//for not show alert every time I refresh the page
    alert.textContent=text

    setTimeout(() => {
        messageContainer.removeChild(alert)
    }, 2000);

    //Make a button
    let messageCloseButton= document.createElement("button")
    messageCloseButton.type="button"
    messageCloseButton.className="btn-close"
    messageCloseButton.ariaLabel="Close"
    messageCloseButton.setAttribute("data-bs-dismiss","alert")
    alert.appendChild(messageCloseButton)
}


function getElementIdFromButton(buttonId){
    let id=buttonId.split("btnDelete-")[1]//splits the string and gets de id
    return id
}

function AJAXdeleteElement(elementId){
    const http= new XMLHttpRequest()
    const apiURL = "http://localhost:3000/operations/delete/"+elementId
    http.onreadystatechange= async function(){
        if(this.readyState == 4 && this.status ==200){
        }
    }
    http.open("DELETE", apiURL)
    http.send()
}


function deleteButtonEvent(deleteButton){
    let elementId

    deleteButton.addEventListener("click",async()=>{//Make an ActionClickListener
        elementId = getElementIdFromButton(deleteButton.id)
        await AJAXdeleteElement(elementId)
        const storage= window.localStorage //Use this for indicate if need show successfull message in redirected page
        storage.setItem("status","3")//status: 3 code represents deleted successful
        refreshData()
        
    })
}

async function refreshData(){
    let newData= await AJAXgetDataList(queryOpSelected)
    let table= document.getElementsByClassName("table")[0]
    if(newData.length!=0){
        let amountElementsOfTable=table.childElementCount
        for (let i = 1; i < amountElementsOfTable; i++) {//Removes elements keeping the table and its header
            table.removeChild(table.lastChild)
        }
        renderOperations(newData,table)
    }else{
        table.innerHTML=""
        renderNotOperations()
    }

}
function selectEvent(){
    //Select type event
    let selectType=document.getElementsByClassName("selectType")[0]
    selectType.addEventListener("change", async function(e){
        if(selectType.value==="All operations"){
            queryOpSelected="?type=all"
        }else if(selectType.value==="Entrys"){
            queryOpSelected="?type=entry"
            
        }else if(selectType.value==="Expenses"){
            queryOpSelected="?type=egress"
        }
        refreshData()
    })
}

async function main(){
    if(await AJAXuserLogedIn()){//Method implemented in helpers.js
        loadNavBar() //Method from helpers
        let data= await AJAXgetDataList(queryOpSelected)
        if(data.length!=0){
            renderTable(data)
        }else{
            renderNotOperations()
        }
    }else{
        window.location.replace("signin.html")
    }
}

main()