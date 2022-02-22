function formatDate(dateString){
    let date = new Date(dateString)
    return date.toLocaleDateString("en-GB")//Format types: "en-US"= mm/dd/yyyy -'en-GB'=dd/mm/yyyy
};

function formatDateToInputType(timestamp){
    const dateNotFormated=new Date(timestamp);
    return dateNotFormated.toISOString().split('T')[0]
}

function colorType(type){
    return type.toUpperCase()==="ENTRY"? "table-success": "table-danger"
}

function typeIsEntry(type){
    return type.toUpperCase()==="ENTRY"? true: false
}

//NAVBAR REQUEST
function AJAXgetNavbar(){
    return new Promise((resolve,reject)=>{
        const http= new XMLHttpRequest()
        const apiURL = "navbar.html"
        http.onreadystatechange= function(){
            if(this.readyState == 4 && this.status ==200){
                resolve(this.responseText)
              
            }   
        }
        http.open("GET", apiURL)
        http.send()
    })
}

function AJAXgetInfoNavbar(apiURL){
    return new Promise((resolve,reject)=>{
        const http= new XMLHttpRequest()
        http.onreadystatechange= function(){
            if(this.readyState == 4 && this.status ==200){
                resolve(this.responseText)
            }   
        }
        http.open("GET", apiURL)
        http.send()
    })
}

//USER REQUEST
function AJAXgetUserData(){//Checks if the user is logged in the sv
    return new Promise((resolve,reject)=>{
        const http= new XMLHttpRequest()
        const apiURL = "http://localhost:3000/user"
        http.onreadystatechange= function(){
            if(this.readyState == 4 && this.status ==200){
                resolve(JSON.parse(this.responseText))
            }   
        }
        http.open("GET", apiURL,false)
        http.send()
    })
}

function AJAXuserLogedIn(){//Checks if the user is logged in the sv
    return new Promise((resolve,reject)=>{
        const http= new XMLHttpRequest()
        const apiURL = "http://localhost:3000/userLogedIn"
        http.onreadystatechange= function(){
            if(this.readyState == 4 && this.status ==200){
                resolve(JSON.parse(this.responseText))
            }   
        }
        http.open("GET", apiURL,false)
        http.send()
    })
}

//NAVAR RENDER
function renderInfoNavBar(navbarInfo){
    let ulInfo= document.getElementsByClassName("navbar-nav")[0]
    ulInfo.innerHTML=navbarInfo 
}

async function loadNavBar(){
    let navbarBody=await AJAXgetNavbar()
    let navbarContainer= document.getElementsByClassName("navbarContainer")[0]
    navbarContainer.innerHTML=navbarBody

    let infoNavbarBody
    if(await AJAXuserLogedIn()){
        infoNavbarBody=await AJAXgetInfoNavbar("navbarLoged.html")
        renderInfoNavBar(infoNavbarBody)
        let userData=await AJAXgetUserData()
        let userEmail= document.getElementById("userEmail")
        userEmail.textContent=userData.email
    }else{
        
        infoNavbarBody=await AJAXgetInfoNavbar("navbarNotLoged.html")
        renderInfoNavBar(infoNavbarBody)
    }

    
    
}

function getDataForm(form){
    let formData= new FormData(form)
    let searchParams= new URLSearchParams()
    for(const pair of formData){
        searchParams.append(pair[0],pair[1])
    }
    return searchParams
}

//Signin/Signup
function makeMessage(messageText){
    let messageContainer= document.getElementsByClassName("messageContainer")[0]
    let alert= document.createElement("div")
    alert.className="alert alert-success alert-dismissible fade show"
    alert.setAttribute("role","alert")
    messageContainer.appendChild(alert)

    //Set the message text according to status number
    alert.className+=" alert-danger" //Sets the background color
    alert.textContent=messageText
    warningMessageShowing=true
}