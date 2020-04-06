<script>

import Home from "./home.svelte";
  function login() {
    let email = document.getElementById("InputEmail1").value;
    let pass = document.getElementById("InputPassword1").value;

    let encodedPass = btoa(pass);

    console.log(encodedPass);

    let user = getUser(email);

   user.then(function(data){
    
    if(atob(data[0].password) === pass){

        sessionStorage.setItem('logged', true);
        sessionStorage.setItem('userName', data[0].user_name);
            

        window.location.replace("./");

    }else{
        alert('wrong user o password')
    }


    })


    async function getUser(email) {
      let rpta = [];
      const res = await fetch(
        "http://159.89.36.186:1337/user-admins/?email=" + email
      );

      const user = await res.json();

      return user;
    }
  }
</script>

<div class="row">

  <div class="col-md-4 col-md-offset-4 well">

    <div class="panel panel-default">
      <div class="panel-body">

        <form id="formLogin">
          <div class="form-group">
            <label for="InputEmail1">Email address</label>
            <input
              type="email"
              class="form-control"
              id="InputEmail1"
              placeholder="Email" />
          </div>
          <div class="form-group">
            <label for="InputPassword1">Password</label>
            <input
              type="password"
              class="form-control"
              id="InputPassword1"
              placeholder="Password" />
          </div>
          <button type="button" class="btn btn-default" on:click={login}>
            Submit
          </button>
        </form>


      </div>
    </div>

  </div>

</div>
