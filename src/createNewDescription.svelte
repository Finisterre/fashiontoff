<script>

  import { afterUpdate } from "svelte";
 
 document.getElementById('breadCrumb').insertAdjacentHTML('beforeend', ' > New Description');

 var BrandsArray;
 var product_types;
 var product_families = [];

 BrandsArray = getBrands();


   afterUpdate(() => {
    console.log(product_types);

  });

  async function getBrands() {
    let rpta = [];
    const res = await fetch(
      "http://159.89.36.186:1337/brands?_limit=1000&_sort=brand_name:ASC" 
       );

    const brands = await res.json();

    product_types = await getProducts_Type();




    return brands;
  }

async function getProducts_Type() {
    let rpta = [];
    const res = await fetch(
      "http://159.89.36.186:1337/amazon-product-types"
    );

    const types = await res.json();

    return types;
}

async function getFamilies() {
    let rpta = [];


    var e = document.getElementById("product_type");
    var type = e.options[e.selectedIndex].value;



    const res = await fetch(
      "http://159.89.36.186:1337/amazon-product-families/?product_type="+encodeURI(type)
    );

    const families = await res.json();
    product_families = families;
    document.getElementById('product_family').disabled = false;
    return families;
}

function enable(select){

    document.getElementById(select).disabled = false;


}


  async function create() {
    let text_body = document.getElementById("text_body").value;
     let brand = document.getElementById("brand").options[document.getElementById("brand").selectedIndex].value;
      let product_type = document.getElementById("product_type").options[document.getElementById("product_type").selectedIndex].value;
       let product_family = document.getElementById("product_family").options[document.getElementById("product_family").selectedIndex].value;
    
    var clean_text_body = text_body.replace('\n', '<br>').replace(/[\n\r]/g, '<br>').trim();

    if (text_body.length <= 2000) {
         document.getElementById("alertWrong").style.display = "none";
      const update = await fetch(
        "http://159.89.36.186:1337/amazon-product-descriptions/" ,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text_body: clean_text_body,
            brand : brand,
            product_type :product_type,
            product_family : product_family
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

{#await BrandsArray}
  <div class="col-md-12">
    <h4>loading......</h4>
  </div>
{:then brands}

<div class="col-md-10 col-md-offset-1">

    <div class="col-md-12">
      <h3
        class="bg-success"
        id="alertSuccess"
        style="display: none; padding:5px">
        Great!! The description text was uploaded succefully!
      </h3>
       <h3
        class="bg-danger"
        id="alertWrong"
        style="display: none; padding:5px">
        The description too long!
      </h3>
      <form>
         <div class="form-row">
          <div class="col">
            <label for="brand">Brand</label>
            <select class="form-control" id="brand" on:change="{() => enable('product_type')}" >
            <option>Select Brand ....</option>
                 {#each brands as brand, i}
                     <option value="{brand.brand_name}">{brand.brand_name}</option>
                 {/each}
            </select>
          </div>
        <div class="form-row">
         <div class="col">
            <label for="product_type">Product Type</label>
            <select class="form-control" id="product_type" on:change="{() => getFamilies()}" disabled>
                <option>Select Product Type</option>
                 {#each product_types as product_type, i}
                     <option value="{product_type.name}">{product_type.name}</option>
                 {/each}
            </select>
          </div>
          <div class="col">
            <label for="product_family">Product Family</label>
             <select class="form-control" id="product_family" disabled>
                  {#each product_families as family, i}
                     <option value="{family.product_family}">{family.product_family}</option>
                 {/each}
            </select>
          </div>
         
        </div>

        <div class="form-group">
          <label for="text_body">Description</label>
          <textarea
            class="form-control"
            id="text_body"
            name="text_body"
            rows="15"></textarea>
        </div>
        <button type="button" class="btn btn-primary" on:click={create}>
          Submit
        </button>
      </form>
    </div>
  </div>

{/await}
  <div class="col-md-10 col-md-offset-1">
  
    <h3>Codigos HTMl</h3>
        <h5>Salto de Línea</h5> 
        <code><span class="tag">&lt;br&gt;</span></code>
         <h5>Inicio de Lista</h5> 
        <code><span class="tag">&lt;ul&gt;</span></code>
         <h5>Item de Lista</h5> 
        <code><span class="tag">&lt;li&gt;</span>Valor<span class="tag">&lt;/li&gt;</span></code>
  </div>
