<script>
  import editDescriptions from "./editDescription.svelte";
   import createNew from "./createNewDescription.svelte";
     import empty from "./empty.svelte";
       import { afterUpdate } from "svelte";


  var descriptionsArray = getDescriptions();
    let FTdata;
     let comp;

     let visible = true;
      afterUpdate(() => {
   
    descriptionsArray = getDescriptions();
  });

   async function remove(id){

           const delRow = await fetch(
        "http://159.89.36.186:1337/amazon-product-descriptions/"+id ,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      var response = await delRow.json();


    descriptionsArray = getDescriptions();


   
  }


  async function getDescriptions() {
    let rpta = [];
    const res = await fetch(
      "http://159.89.36.186:1337/amazon-product-descriptions/?_limit=1000&_sort=updatedAt:DESC"
    );

    const descriptions = await res.json();

    return descriptions;
  }


  function loadComp(id_register) {
      visible = false;
    FTdata = id_register;
    comp = editDescriptions;

  

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
<button type="button" class="btn btn-link"id="BACK" on:click={() => clear()}><b id='title'>Descriptions</b></button><b id="breadCrumb">&nbsp;</b>
{:else}
<h3 id='title'>Descriptions</h3>
{/if}



<div class="row">

  {#await descriptionsArray}
    loading......
  {:then descriptions}
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

          {#each descriptions as description, i}
            <tr>
              <th scope="row">{i}</th>
              <td>{description.brand}</td>
              <td>{description.product_type}</td>
               <td>{description.product_family}</td>
              <td>
                <button
            type="button"
            class="btn btn-info"
             id="EDIT{i}"
            on:click={() => loadComp(description.id)}>
            Edit
          </button>

              </td>
               <td>
                <button
            type="button"
            class="btn btn-danger"
             id="DELETE{i}"
            on:click={() => remove(description.id)}>
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
