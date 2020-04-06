<script>
  export let FTdata;
  var keyWordsData;

  

  import { afterUpdate } from "svelte";

  afterUpdate(() => {
    console.log("aca:" + FTdata);
    keyWordsData = getkeyWords();
  });

  keyWordsData = getkeyWords();
  document.getElementById('breadCrumb').insertAdjacentHTML('beforeend', ' > Edit Keywords');

  async function getkeyWords() {
    let rpta = [];
    const res = await fetch(
      "http://159.89.36.186:1337/amazon-products-keywords/" + FTdata
    );

    const keywords = await res.json();

   

    return keywords;
  }

  async function update() {
    let keywordsId = document.getElementById("id").value;
    let generic_keywords = document.getElementById("generic_keywords").value;
     let target_audience_keywords_1 = document.getElementById("target_audience_keywords_1").value;
     let target_audience_keywords_2 = document.getElementById("target_audience_keywords_2").value;
     let target_audience_keywords_3 = document.getElementById("target_audience_keywords_3").value;
     let target_audience_keywords_4 = document.getElementById("target_audience_keywords_4").value;
     let target_audience_keywords_5 = document.getElementById("target_audience_keywords_5").value;
      let style_keywords = document.getElementById("style_keywords").value;

    
   // var clean_text_body = text_body.replace('\n', '<br>').replace(/[\n\r]/g, '<br>').trim();

    
         document.getElementById("alertWrong").style.display = "none";
      const update = await fetch(
        "http://159.89.36.186:1337/amazon-products-keywords/" +
          keywordsId,
        {
          method: "PUT",
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
            style_keywords: style_keywords
          })
        }
      );

      var response = await update.json();

      document.getElementById("alertSuccess").style.display = "block";

  }


</script>

{#await keyWordsData}
  <div class="col-md-12">
    <h4>loading......</h4>
  </div>
{:then keywordsSet}
  <div class="col-md-10 col-md-offset-1">

    <div class="col-md-12">
      <h3
        class="bg-success"
        id="alertSuccess"
        style="display: none; padding:5px">
        Great!! The keyword set was updated succefully!
      </h3>
       <h3
        class="bg-danger"
        id="alertWrong"
        style="display: none; padding:5px">
        The description too long!
      </h3>
      <form>
        <input type="hidden" name="id" id="id" value={keywordsSet.id} />
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
              value={keywordsSet.brand} />
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
              value={keywordsSet.product_type} />
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
              value={keywordsSet.product_family} />
          </div>
         
        </div>

        <div class="form-group">
          <label for="text_body">Generic keywords</label>
          <textarea
            class="form-control"
            id="generic_keywords"
            name="generic_keywords"
            rows="5">{keywordsSet.generic_keywords}</textarea>
        </div>
           <div class="form-group">
          <label for="text_body">Target audience keywords n°1</label>
          <textarea
            class="form-control"
            id="target_audience_keywords_1"
            name="text_body"
            rows="5">{keywordsSet.target_audience_keywords_1}</textarea>
        </div>
         <div class="form-group">
          <label for="text_body">Target audience keywords n°2</label>
          <textarea
            class="form-control"
            id="target_audience_keywords_2"
            name="text_body"
            rows="5">{keywordsSet.target_audience_keywords_2}</textarea>
        </div>
         <div class="form-group">
          <label for="text_body">Target audience keywords n°3</label>
          <textarea
            class="form-control"
            id="target_audience_keywords_3"
            name="text_body"
            rows="5">{keywordsSet.target_audience_keywords_3}</textarea>
        </div>
         <div class="form-group">
          <label for="text_body">Target audience keywords n°4</label>
          <textarea
            class="form-control"
            id="target_audience_keywords_4"
            name="text_body"
            rows="5">{keywordsSet.target_audience_keywords_4}</textarea>
        </div>
         <div class="form-group">
          <label for="text_body">Target audience keywords n°5</label>
          <textarea
            class="form-control"
            id="target_audience_keywords_5"
            name="text_body"
            rows="5">{keywordsSet.target_audience_keywords_5}</textarea>
        </div>
          <div class="form-group">
          <label for="text_body">Style keywords</label>
          <textarea
            class="form-control"
            id="style_keywords"
            name="text_body"
            rows="5">{keywordsSet.style_keywords}</textarea>
        </div>
        <button type="button" class="btn btn-primary" on:click={update}>
          Submit
        </button>
      </form>
    </div>
  </div>


{/await}
