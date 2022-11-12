
const btn = document.getElementById('btn');
const username = document.getElementById('username');
const password = document.getElementById('password');
const msg = document.getElementById('msg');


async function authUser(event){
    event.preventDefault();
  
    const data = {
      username : username.value,
      password : password.value
    } ;
    console.log(data);
    await fetch("/login", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then((data) => {
        if(data.status)
        location.href = `/user/${username.value}`
        else
        msg.innerText = data.message;
      })  
}
btn.addEventListener('click',authUser);