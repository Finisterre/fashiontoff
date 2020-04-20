<script>
  import Home from "./home.svelte";
  import Amazon from "./amazonFiles.svelte";
  import Shopify from "./shopifyFiles.svelte";
  import Descriptions from "./Descriptions.svelte";
  import Keywords from "./keywords.svelte";
  import Bullets from "./bullets.svelte";
  import login from "./login.svelte";
  import BlackList from "./blackList.svelte";
  import CountryRates from "./countryRates.svelte";
  import Matchs from "./matchs.svelte";
  import { afterUpdate } from "svelte";

  
        sessionStorage.setItem('test', true);


  let logged = sessionStorage.getItem("logged");
  let user = "";

  afterUpdate(() => {
    logged = sessionStorage.getItem("logged");
    user = sessionStorage.getItem("userName");

    console.log("update");
  });

  let FTdata;
  let comp;

  FTdata = { title: "Fashion Tof" };
  comp = Home;

  function loadComp(newComp) {
    FTdata = newComp;
    comp = newComp;
  }
</script>

<style>
  /* Set height of the grid so .sidenav can be 100% (adjust if needed) */
  .row.content {
    height: 1500px;
  }

  /* Set gray background color and 100% height */
  .sidenav {
    background-color: #30353c;
    height: 100%;
  }

  .navbar {
    margin-bottom: 0 !important;
    border-radius: 0 !important;
  }

  .nav-pills li.active button {
    color: #fff;
    background-color: #337ab7;
  }

  /* Set black background color, white text and some padding */
  footer {
    background-color: #555;
    color: white;
    padding: 15px;
  }

  /* On small screens, set height to 'auto' for sidenav and grid */
  @media screen and (max-width: 767px) {
    .sidenav {
      height: auto;
      padding: 15px;
    }
    .row.content {
      height: auto;
    }
  }
</style>

<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <button
        type="button"
        class="navbar-toggle"
        data-toggle="collapse"
        data-target="/myNavbar">
        <span class="icon-bar" />
        <span class="icon-bar" />
        <span class="icon-bar" />
      </button>
      <img
        src="https://cdn.shopify.com/s/files/1/0265/8972/4732/files/VERTICAL_BLACK_FASHION_TOF_180x.jpg?v=1566866651"
        alt="FT"
        width="45px"
        hspace="5"
        class="m-2" />
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
      <!-- <ul class="nav navbar-nav">
        <li class="active"><a href="/">Home</a></li>
        <li><a href="/">About</a></li>
        <li><a href="/">Gallery</a></li>
        <li><a href="/">Contact</a></li>
      </ul>-->
      <ul class="nav navbar-nav navbar-right">
        {#if logged}
          <li>
            <span style=" margin-top: 10px; float: right; color: white; " class="text-capitalize">
              Welcome, {user}
            </span>
          </li>
        {:else}
          <li>
            <button
              type="button"
              class="btn btn-link"
              data-comp="Amazon"
              data-title="Amazon Files"
              id="login"
              on:click={() => loadComp(login)}>
              <span class="glyphicon glyphicon-log-in" />
              Login
            </button>

          </li>
        {/if}
      </ul>
    </div>
  </div>
</nav>
<div class="container-fluid">
  <div class="row content">
    <div class="col-sm-2 sidenav ">
      <br />
      <ul class="nav nav-pills nav-stacked">
        <li class="active">
          <a href="/">Home</a>
        </li>
        <li>
          <button
            type="button"
            class="btn btn-link"
            data-comp="Amazon"
            data-title="Amazon Files"
            id="Amazon"
            on:click={() => loadComp(Amazon)}>
            Amazon Files
          </button>

        </li>
        <li>

          <button
            type="button"
            class="btn btn-link"
            data-comp="Amazon"
            data-title="Amazon Files"
            id="Shopify"
            on:click={() => loadComp(Shopify)}>
            Shopify Files
          </button>

        </li>
      </ul>
      <br />
      <hr />
      {#if logged}
        <ul class="nav nav-pills nav-stacked d-none">
          <li>

            <button
              type="button"
              class="btn btn-link"
              data-comp="Descriptions"
              data-title="Descriptions"
              id="Descriptions"
              on:click={() => loadComp(Descriptions)}>
              Descriptions
            </button>
          </li>
          <li>

            <button
              type="button"
              class="btn btn-link"
              id="Keywords"
              on:click={() => loadComp(Keywords)}>
              Keywords
            </button>
          </li>
          <li>

            <button
              type="button"
              class="btn btn-link"
              id="Bullets"
              on:click={() => loadComp(Bullets)}>
              Bullets
            </button>
          </li>

           <li>

            <button
              type="button"
              class="btn btn-link"
              id="BlackList"
              on:click={() => loadComp(BlackList)}>
              BlackList
            </button>
          </li>
            <li>

            <button
              type="button"
              class="btn btn-link"
              id="countryRates"
              on:click={() => loadComp(CountryRates)}>
              Country Rates
            </button>
          </li>
             <li>

            <button
              type="button"
              class="btn btn-link"
              id="dictionary"
              on:click={() => loadComp(Matchs)}>
              Dictionary
            </button>
          </li>

        </ul>
      {/if}
      <br />
    </div>
    <div class="col-sm-10">

      <svelte:component this={comp} bind:FTdata />

    </div>

  </div>

</div>

<footer class="container-fluid">
  <p>Footer Text</p>
</footer>

<!--   <div class="input-group">
        <input type="text" class="form-control" placeholder="Search Blog..">
        <span class="input-group-btn">
          <button class="btn btn-default" type="button">
            <span class="glyphicon glyphicon-search"></span>
          </button>
        </span>
      </div>
-->
