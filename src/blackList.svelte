<script>
  import createNew from "./createNewBanned.svelte";
     import empty from "./empty.svelte";
       import { afterUpdate } from "svelte";


  var bannedArray = getBlaskList();
    let FTdata;
     let comp;

     let visible = true;
      afterUpdate(() => {
   
    bannedArray = getBlaskList();
  });


  async function getBlaskList() {
    let rpta = [];
    const res = await fetch(
      "http://159.89.36.186:1337/black-lists/?_limit=1000&_sort=updatedAt:DESC"
    );

    const banned = await res.json();

    return banned;
  }


  function loadComp(id_register) {
      visible = false;
    FTdata = id_register;
    comp = editDescriptions;

  

  }

  function deleteReg(id){

 var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = "";

var requestOptions = {
  method: 'DELETE',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://159.89.36.186:1337/black-lists/"+id, requestOptions)
  .then(response =>  bannedArray = getBlaskList())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));



  }

  function loadNew(){
       visible = false;
    comp = createNew;

  }


   function clear(){
     
    comp = empty;
    visible = true;

  }
</script>
{#if !visible}   
<button type="button" class="btn btn-link"id="BACK" on:click={() => clear()}><b id='title'>Black List</b></button><b id="breadCrumb">&nbsp;</b>
{:else}
<h3 id='title'>Black List</h3>
{/if}



<div class="row">

  {#await bannedArray}
    loading......
  {:then bannedList}
    {#if visible}
    <div class="col-md-12">

      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Brand</th>
            <th>Product Family</th>
             <th>Country</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>

          {#each bannedList as banned, i}
            <tr>
              <th scope="row">{i}</th>
              <td>{banned.brand}</td>
               <td>{banned.product_family}</td>
               <td>{banned.country}</td>
               <td>
                <button
            type="button"
            class="btn btn-danger"
             id="DELETE{i}"
            on:click={() =>  deleteReg(banned.id)}>
           Delete
          </button>

              </td>
            </tr>
          {/each}

        </tbody>
      </table>

      <hr>
      <button
            type="button"
            class="btn btn-info"
             id="NEW"
            on:click={() => loadNew()}>
          Create New
          </button>


    </div>

    {/if}
  {/await}
</div>


<div class="row">


 <svelte:component this={comp} bind:FTdata />


</div>
