<script>

  import { afterUpdate } from "svelte";
 
 document.getElementById('breadCrumb').insertAdjacentHTML('beforeend', ' > New Bullets Point');

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
    let bullet_1 = document.getElementById("bullet_1").value;
    let bullet_2 = document.getElementById("bullet_2").value;
    let bullet_3 = document.getElementById("bullet_3").value;
    let bullet_4 = document.getElementById("bullet_4").value;
    let bullet_5 = document.getElementById("bullet_5").value;
    let brand = document.getElementById("brand").options[document.getElementById("brand").selectedIndex].value;
    let product_type = document.getElementById("product_type").options[document.getElementById("product_type").selectedIndex].value;
    let product_family = document.getElementById("product_family").options[document.getElementById("product_family").selectedIndex].value;
    

    

    if(bullet_1.length <= 500 && bullet_2.length <= 500 && bullet_3.length <= 500 && bullet_4.length <= 500 && bullet_5.length <= 500 ){
               document.getElementById("alertWrong").style.display = "none";
      const update = await fetch(
        "http://159.89.36.186:1337/bullet-points/" ,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            bullet_1: bullet_1.replace('\n', '<br>').replace(/[\n\r]/g, '<br>').trim(),
            bullet_2: bullet_2.replace('\n', '<br>').replace(/[\n\r]/g, '<br>').trim(),
            bullet_3: bullet_3.replace('\n', '<br>').replace(/[\n\r]/g, '<br>').trim(),
            bullet_4: bullet_4.replace('\n', '<br>').replace(/[\n\r]/g, '<br>').trim(),
             bullet_5: bullet_5.replace('\n', '<br>').replace(/[\n\r]/g, '<br>').trim(),
            brand : brand,
            product_type :product_type,
            product_family : product_family
          })
        }
      );

      var response = await update.json();

      document.getElementById("alertSuccess").style.display = "block";

    }else{

             for (let index = 1; index < 6; index++) {

             var bullet =  document.getElementById('bullet_'+index).value;
     
          var count = bullet.length;

          if (count > 500){

            alert ("Bullet Set N°"+index+",  posee mas de 500 caracteres ("+count+")");

        

          }

      }




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
        Great!! The Bullet Set was uploaded succefully!
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
          <label for="text_body">Bullet Set n° 1</label>
          <textarea
            class="form-control"
            id="bullet_1"
            name="Bullet_1"
            rows="10"></textarea>
        </div>

         <div class="form-group">
          <label for="text_body">Bullet Set n° 2</label>
          <textarea
            class="form-control"
            id="bullet_2"
            name="Bullet_2"
            rows="10"></textarea>
        </div>
          <div class="form-group">
          <label for="text_body">Bullet Set n° 3</label>
          <textarea
            class="form-control"
            id="bullet_3"
            name="Bullet_3"
            rows="10"></textarea>
        </div>
          <div class="form-group">
          <label for="text_body">Bullet Set n° 4</label>
          <textarea
            class="form-control"
            id="bullet_4"
            name="Bullet_4"
            rows="10"></textarea>
        </div>
         <div class="form-group">
          <label for="text_body">Bullet Set n° 5</label>
          <textarea
            class="form-control"
            id="bullet_5"
            name="Bullet_5"
            rows="10"></textarea>
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
