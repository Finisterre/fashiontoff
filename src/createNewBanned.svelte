<script>

  import { afterUpdate } from "svelte";
 
 document.getElementById('breadCrumb').insertAdjacentHTML('beforeend', ' > New Banned Brand');

 var BrandsArray;
 var product_types;
 var countrys;

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

     countrys = await getCountrys();

    return types;
}



function enable(select){

    document.getElementById(select).disabled = false;


}


  async function create() {
    let brand = document.getElementById("brand").options[document.getElementById("brand").selectedIndex].value;
    let product_type = document.getElementById("product_type").options[document.getElementById("product_type").selectedIndex].value;
     let country = document.getElementById("country").options[document.getElementById("country").selectedIndex].value;
 
    
   

 
         document.getElementById("alertWrong").style.display = "none";
      const update = await fetch(
        "http://159.89.36.186:1337/black-lists/" ,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            brand : brand,
            product_family :product_type,
            country :country
          })
        }
      );

      var response = await update.json();

      document.getElementById("alertSuccess").style.display = "block";

  }


async function getCountrys(){

      const res = await fetch(
      "https://evaluacion.olx-autos.com.ar/countryrates"
    );

    const countrys = await res.json();

    console.log(countrys)

    return countrys;

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
        Great!! The Banned Brand was set succefully!
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
            <select class="form-control" id="product_type" on:change="{() => enable('country')}"   disabled>
                <option>Select Product Type</option>
                 {#each product_types as product_type, i}
                     <option value="{product_type.name}">{product_type.name}</option>
                 {/each}
            </select>
          </div>
      
         
        </div>
          <div class="form-row">
         <div class="col">
            <label for="country">Country</label>
            <select class="form-control" id="country"  disabled>
                <option>Select Country </option>
                 {#each countrys as country, i}
                     <option value="{country.country}">{country.countryName}</option>
                 {/each}
            </select>
          </div>
      
         
        </div>
            <br>
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
