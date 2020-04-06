<script>
  import editBullets from "./editBullets.svelte";
  import createNew from "./createNewBullets.svelte";
     import empty from "./empty.svelte";
       import { afterUpdate } from "svelte";


  var BulletsArray = getBullets();
    let FTdata;
     let comp;

     let visible = true;

       afterUpdate(() => {
   
    BulletsArray = getBullets();
  });


  


  async function getBullets() {
    let rpta = [];
    const res = await fetch(
      "http://159.89.36.186:1337/bullet-points/?_limit=1000&_sort=updatedAt:DESC"
    );

    const Bullets = await res.json();

    return Bullets;
  }

  async function remove(id){

           const delRow = await fetch(
        "http://159.89.36.186:1337/bullet-points/"+id ,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      var response = await delRow.json();


    BulletsArray = getBullets();


   
  }


  function loadComp(id_register) {
      visible = false;
    FTdata = id_register;
    comp = editBullets;
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
<button type="button" class="btn btn-link"id="BACK" on:click={() => clear()}><b id='title'>Bullet Points</b></button><b id="breadCrumb">&nbsp;</b>
{:else}
<h3 id='title'>Bullet Points</h3>
{/if}



<div class="row">

  {#await BulletsArray}
    loading......
  {:then bulletsSet}
    {#if visible}
    <div class="col-md-12">

      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Brand</th>
            <th>Product Type</th>
            <th>Product Family</th>
            <th>&nbsp;</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>

          {#each bulletsSet as bullets, i}
            <tr>
              <th scope="row">{i}</th>
              <td>{bullets.brand}</td>
              <td>{bullets.product_type}</td>
               <td>{bullets.product_family}</td>
              <td>
                <button
            type="button"
            class="btn btn-info"
             id="EDIT{i}"
            on:click={() => loadComp(bullets.id)}>
            Edit
          </button>

              </td>
               <td>
                <button
            type="button"
            class="btn btn-danger"
             id="DELETE{i}"
            on:click={() => remove(bullets.id)}>
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
