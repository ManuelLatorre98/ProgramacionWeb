function AJAXgetNavbar(){
    const http= new XMLHttpRequest()
    const apiURL = "navbar.html"
    http.onreadystatechange= function(){
        if(this.readyState == 4 && this.status ==200){
            console.log(this.responseText)
            let data=JSON.parse(this.responseText)
            showActualValues(data[0],id)
        }   
    }
    http.open("GET", apiURL)
    http.send()
}

function main(){
    AJAXgetNavbar()
}
main()