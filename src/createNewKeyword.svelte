<script>

  import { afterUpdate } from "svelte";
 
 document.getElementById('breadCrumb').insertAdjacentHTML('beforeend', ' > New Keywords Set');

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
   
     let brand = document.getElementById("brand").options[document.getElementById("brand").selectedIndex].value;
      let product_type = document.getElementById("product_type").options[document.getElementById("product_type").selectedIndex].value;
       let product_family = document.getElementById("product_family").options[document.getElementById("product_family").selectedIndex].value;
    
      let generic_keywords = document.getElementById("generic_keywords").value;
     let target_audience_keywords_1 = document.getElementById("target_audience_keywords_1").value;
     let target_audience_keywords_2 = document.getElementById("target_audience_keywords_2").value;
     let target_audience_keywords_3 = document.getElementById("target_audience_keywords_3").value;
     let target_audience_keywords_4 = document.getElementById("target_audience_keywords_4").value;
     let target_audience_keywords_5 = document.getElementById("target_audience_keywords_5").value;
      let style_keywords = document.getElementById("style_keywords").value;
      


         document.getElementById("alertWrong").style.display = "none";
      const update = await fetch(
        "http://159.89.36.186:1337/amazon-products-keywords/" ,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            generic_keywords: generic_keywords,
            target_audience_keywords_1: target_audience_keywords_1,
            target_audience_keywords_2: target_audience_keywords_2,
            target_audience_keywords_3: target_audience_keywords_3,
            target_audience_keywords_4: target_audience_keywords_4,
            target_audience_keywords_5: target_audience_keywords_5,
            style_keywords: style_keywords,
            brand : brand,
            product_type :product_type,
            product_family : product_family
          })
        }
      );

      var response = await update.json();

      document.getElementById("alertSuccess").style.display = "block";

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
          <label for="text_body">Generic keywords</label>
          <textarea
            class="form-control"
            id="generic_keywords"
            name="generic_keywords"
            rows="5"></textarea>
        </div>
          <div class="form-group">
          <label for="text_body">Target audience keywords n°1</label>
          <textarea
            class="form-control"
            id="target_audience_keywords_1"
            name="text_body"
            rows="5"></textarea>
        </div>
         <div class="form-group">
          <label for="text_body">Target audience keywords n°2</label>
          <textarea
            class="form-control"
            id="target_audience_keywords_2"
            name="text_body"
            rows="5"></textarea>
        </div>
         <div class="form-group">
          <label for="text_body">Target audience keywords n°3</label>
          <textarea
            class="form-control"
            id="target_audience_keywords_3"
            name="text_body"
            rows="5"></textarea>
        </div>
         <div class="form-group">
          <label for="text_body">Target audience keywords n°4</label>
          <textarea
            class="form-control"
            id="target_audience_keywords_4"
            name="text_body"
            rows="5"></textarea>
        </div>
         <div class="form-group">
          <label for="text_body">Target audience keywords n°5</label>
          <textarea
            class="form-control"
            id="target_audience_keywords_5"
            name="text_body"
            rows="5"></textarea>
        </div>
          <div class="form-group">
          <label for="text_body">Style keywords</label>
          <textarea
            class="form-control"
            id="style_keywords"
            name="text_body"
            rows="5"></textarea>
        </div>
        <button type="button" class="btn btn-primary" on:click={create}>
          Submit
        </button>
      </form>
    </div>
  </div>

{/await}
