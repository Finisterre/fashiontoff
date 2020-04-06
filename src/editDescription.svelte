<script>
  export let FTdata;
  var descriptionsData;

  

  import { afterUpdate } from "svelte";

  afterUpdate(() => {
    console.log("aca:" + FTdata);
    descriptionsData = getDescription();
  });

  descriptionsData = getDescription();
  document.getElementById('breadCrumb').insertAdjacentHTML('beforeend', ' > Edit Description');

  async function getDescription() {
    let rpta = [];
    const res = await fetch(
      "http://159.89.36.186:1337/amazon-product-descriptions/" + FTdata
    );

    const description = await res.json();

   

    return description;
  }

  async function update() {
    let descriptionId = document.getElementById("id").value;
    let text_body = document.getElementById("text_body").value;
    
    var clean_text_body = text_body.replace('\n', '<br>').replace(/[\n\r]/g, '<br>').trim();

    if (text_body.length <= 2000) {
         document.getElementById("alertWrong").style.display = "none";
      const update = await fetch(
        "http://159.89.36.186:1337/amazon-product-descriptions/" +
          descriptionId,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text_body: clean_text_body
          })
        }
      );

      var response = await update.json();

      document.getElementById("alertSuccess").style.display = "block";
      
    } else {

   
         document.getElementById("alertWrong").style.display = "block";
    }
  }


</script>

{#await descriptionsData}
  <div class="col-md-12">
    <h4>loading......</h4>
  </div>
{:then description}
  <div class="col-md-10 col-md-offset-1">

    <div class="col-md-12">
      <h3
        class="bg-success"
        id="alertSuccess"
        style="display: none; padding:5px">
        Great!! The description text was updated succefully!
      </h3>
       <h3
        class="bg-danger"
        id="alertWrong"
        style="display: none; padding:5px">
        The description too long!
      </h3>
      <form>
        <input type="hidden" name="id" id="id" value={description.id} />
         <div class="form-row">
          <div class="col">
            <label for="brand">Brand</label>
            <input
              type="text"
              name="brand"
              class="form-control"
              id="brand"
              placeholder=""
              disabled
              value={description.brand} />
          </div>
        <div class="form-row">
         <div class="col">
            <label for="product_type">Product Type</label>
            <input
              type="text"
              name="product_type"
              class="form-control"
              id="product_type"
              placeholder=""
              disabled
              value={description.product_type} />
          </div>
          <div class="col">
            <label for="product_family">Product Family</label>
            <input
              type="text"
              name="product_family"
              class="form-control"
              id="product_family"
              placeholder=""
              disabled
              value={description.product_family} />
          </div>
         
        </div>

        <div class="form-group">
          <label for="text_body">Description</label>
          <textarea
            class="form-control"
            id="text_body"
            name="text_body"
            rows="15">{description.text_body}</textarea>
        </div>
        <button type="button" class="btn btn-primary" on:click={update}>
          Submit
        </button>
      </form>
    </div>
  </div>


  <div class="col-md-10 col-md-offset-1">
  
    <h3>Codigos HTML</h3>
        <h5>Salto de Línea</h5> 
        <code><span class="tag">&lt;br&gt;</span></code>
         <h5>Inicio de Lista</h5> 
        <code><span class="tag">&lt;ul&gt;</span></code>
         <h5>Item de Lista</h5> 
        <code><span class="tag">&lt;li&gt;</span>Valor<span class="tag">&lt;/li&gt;</span></code>
          <h5>Fin de Lista</h5> 
        <code><span class="tag">&lt;/ul&gt;</span></code>
  </div>

{/await}
