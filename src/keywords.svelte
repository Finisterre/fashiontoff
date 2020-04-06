<script>
  import editkeywords from "./editkeyword.svelte";
 import createNew from "./createNewkeyword.svelte";
     import empty from "./empty.svelte";
       import { afterUpdate } from "svelte";


  var keywordsArray = getKeywords();
    let FTdata;
     let comp;

     let visible = true;

       afterUpdate(() => {
   
    keywordsArray = getKeywords();
  });



  async function getKeywords() {
    let rpta = [];
    const res = await fetch(
      "http://159.89.36.186:1337/amazon-products-keywords/?_limit=1000&_sort=updatedAt:DESC"
    );

    const keywords = await res.json();

    return keywords;
  }


  function loadComp(id_register) {
      visible = false;
    FTdata = id_register;
    comp = editkeywords;

  

  }

  function loadNew(){
       visible = false;
    comp = createNew;

  }

   async function remove(id){

           const delRow = await fetch(
        "http://159.89.36.186:1337/amazon-products-keywords/"+id ,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      var response = await delRow.json();


    keywordsArray = getKeywords();


   
  }

   function clear(){
     
    comp = empty;
    visible = true;

  }
</script>


{#if !visible}   
<button type="button" class="btn btn-link"id="BACK" on:click={() => clear()}><b id='title'>Keywords</b></button><b id="breadCrumb">&nbsp;</b>
{:else}
<h3 id='title'>Keywords</h3>
{/if}



<div class="row">

  {#await keywordsArray}
    loading......
  {:then keywords}
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

          {#each keywords as keyword, i}
            <tr>
              <th scope="row">{i}</th>
              <td>{keyword.brand}</td>
              <td>{keyword.product_type}</td>
               <td>{keyword.product_family}</td>
              <td>
                <button
            type="button"
            class="btn btn-info"
             id="EDIT{i}"
            on:click={() => loadComp(keyword.id)}>
            Edit
          </button>

              </td>
               <td>
                <button
            type="button"
            class="btn btn-danger"
             id="DELETE{i}"
            on:click={() => remove(keyword.id)}>
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
