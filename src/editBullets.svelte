<script>
  export let FTdata;
  var BulletsData;

  

  import { afterUpdate } from "svelte";

  afterUpdate(() => {
    console.log("aca:" + FTdata);
    BulletsData = getBullets();
  });

  BulletsData = getBullets();
  document.getElementById('breadCrumb').insertAdjacentHTML('beforeend', ' > Edit Bullet Points');

  async function getBullets() {
    let rpta = [];
    const res = await fetch(
      "http://159.89.36.186:1337/bullet-points/" + FTdata
    );

    const Bullets = await res.json();

   

    return Bullets;
  }

  async function update() {
    let bulletsId = document.getElementById("id").value;
    let bullet_1 = document.getElementById("bullet_1").value;
    let bullet_2 = document.getElementById("bullet_2").value;
    let bullet_3 = document.getElementById("bullet_3").value;
    let bullet_4 = document.getElementById("bullet_4").value;
     let bullet_5 = document.getElementById("bullet_5").value;

         for (let index = 1; index <= 5; index++) {

          var bullet =  document.getElementById('bullet_'+index).value;
     
          var count = bullet.length;

          console.log(count);


        
      }
    
   // var clean_text_body = text_body.replace('\n', '<br>').replace(/[\n\r]/g, '<br>').trim();

     if(bullet_1.length <= 500 && bullet_2.length <= 500 && bullet_3.length <= 500 && bullet_4.length <= 500 && bullet_5.length <= 500 ){
         document.getElementById("alertWrong").style.display = "none";
      const update = await fetch(
        "http://159.89.36.186:1337/bullet-points/" +
          bulletsId,
        {
          method: "PUT",
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
          
          })
        }
      );

      var response = await update.json();

      document.getElementById("alertSuccess").style.display = "block";
     }else{
       console.log('tu vieja')
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

{#await BulletsData}
  <div class="col-md-12">
    <h4>loading......</h4>
  </div>
{:then BulletsSet}
  <div class="col-md-10 col-md-offset-1">

    <div class="col-md-12">
      <h3
        class="bg-success"
        id="alertSuccess"
        style="display: none; padding:5px">
        Great!! The bullet set was updated succefully!
      </h3>
       <h3
        class="bg-danger"
        id="alertWrong"
        style="display: none; padding:5px">
        The description too long!
      </h3>
      <form>
        <input type="hidden" name="id" id="id" value={BulletsSet.id} />
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
              value={BulletsSet.brand} />
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
              value={BulletsSet.product_type} />
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
              value={BulletsSet.product_family} />
          </div>
         
        </div>

        <div class="form-group">
          <label for="text_body">Bullet Set n° 1</label>
          <textarea
            class="form-control"
            id="bullet_1"
            name="Bullet_1"
            rows="10">{BulletsSet.bullet_1}</textarea>
        </div>

         <div class="form-group">
          <label for="text_body">Bullet Set n° 2</label>
          <textarea
            class="form-control"
            id="bullet_2"
            name="Bullet_2"
            rows="10">{BulletsSet.bullet_2}</textarea>
        </div>
          <div class="form-group">
          <label for="text_body">Bullet Set n° 3</label>
          <textarea
            class="form-control"
            id="bullet_3"
            name="Bullet_3"
            rows="10">{BulletsSet.bullet_3}</textarea>
        </div>
          <div class="form-group">
          <label for="text_body">Bullet Set n° 4</label>
          <textarea
            class="form-control"
            id="bullet_4"
            name="Bullet_4"
            rows="10">{BulletsSet.bullet_4}</textarea>
        </div>
              <div class="form-group">
          <label for="text_body">Bullet Set n° 5</label>
          <textarea
            class="form-control"
            id="bullet_5"
            name="Bullet_5"
            rows="10">{BulletsSet.bullet_5}</textarea>
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
