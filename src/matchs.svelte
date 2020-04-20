<script>
  import { afterUpdate } from "svelte";

  let FTdata;
  let comp;

  let visible = true;

  let long;

  var matchsArray = getMatchs();

  afterUpdate(() => {
    matchsArray = getMatchs();
  });

  async function getMatchs() {
    let rpta = [];
    const res = await fetch("http://159.89.36.186:1337/matchs");

    const matchs = await res.json();

    long = matchs[0].rpta.length;

    console.log(matchs);
     window.scrollTo(0, 0);

    return matchs[0];
  }

  async function updateData(i) {
    var eng;
    var esp;

    var rpta = [];

    var recordId = document.getElementById("recordId").value;

    const elements = document.querySelectorAll("tr");
    Array.from(elements).forEach((element, index) => {
      var match;
      const elements2 = element.querySelectorAll("td");
      Array.from(elements2).forEach((element2, i) => {
        if (i == 1) {
          esp = element2.firstChild.value;
        }

        if (i == 2) {
          eng = element2.firstChild.value;
        }
        
        match = {
          match: {
            esp: esp,
            eng: eng
          }
        };
      });

      if (match != undefined) {
        rpta.push(match);
      }
    });

    const response = await fetch(
      "http://159.89.36.186:1337/matchs/" + recordId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rpta: rpta
        })
      }
    ).then(function() {
          alert("la lista fue actualizada");
          setTimeout(matchsArray = getMatchs(), 100);
   
      
      
  
    });
  }

  function addOne() {
    console.log(long);
    long = long + 1;

    console.log(long);

    var table = document.getElementById("MatchList");
    var row = table.insertRow(long);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = long;
    cell2.innerHTML =
      '<input type="text" value="" placeholder="Spanish" class="esp col-md-10">';
    cell3.innerHTML =
      '<input type="text" value="" placeholder="English" class="eng col-md-10">';
  }
</script>

<h3 id="title">Dictionary</h3>
<div class="row">

  {#await matchsArray}
    loading......
  {:then matchs}
    {#if visible}
      <div class="col-md-12">
        <table class="table table-striped" id="MatchList">
          <thead>
            <tr>
              <th>#</th>
              <th>Spanish</th>
              <th>English</th>

            </tr>
          </thead>
          <tbody>
            <input type="hidden" id="recordId" value={matchs.id} />
            {#each matchs.rpta as word, i}
              <tr class="f-row">
                <td>{i + 1}</td>
                <td>
                  <input
                    type="text"
                    value={word.match.esp}
                    class="esp col-md-10" onkeyup="this.value = this.value.toUpperCase();"/>
                </td>
                <td>
                  <input
                    type="text"
                    value={word.match.eng}
                    class="eng col-md-10" onkeyup="this.value = this.value.toUpperCase();" />
                </td>
              </tr>
            {/each}
          </tbody>

        </table>
      </div>
    {/if}
  {/await}
</div>
<div class="row">
  <div class="col-md-12 mb-5">

    <button
      type="button"
      class="btn btn-info"
      id="addBtn"
      on:click={() => addOne()}>
      Add One
    </button>
    <button
      type="button"
      class="btn btn-success"
      id="update"
      on:click={() => updateData()}>
      Update Data
    </button>

  </div>
  <br />
  <hr />
  <br />

</div>
