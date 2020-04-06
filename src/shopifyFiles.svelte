<script>

  let DataFiles = "tu vieja";
  let linkArray = new Array();
  fetch("/api")
    .then(res => res.json())
    .then(function(data, index) {
      DataFiles = data;

      data.forEach(element => {
        var link = element.file;
        linkArray.push(link);
      });
    });

  function allDownload(linkArray) {
    linkArray.forEach(element => {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        if (element.company == "SHOPIFY") {
          link.setAttribute("href", "./" + element.file);
          link.setAttribute("download", element.file);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
  }
</script>

{#await DataFiles}
  <h3 class="text-white text-center">Procesando Información</h3>
  <div class="spinner-border " role="status">
    <span class="sr-only">Loading...</span>
  </div>

{:then data}

<div class="row">
    <div class="col-md-12">

      <h1>
        SHOPIFY Files
        <button
          type="button"
          class="btn btn-info"
          on:click={() => allDownload(data)}>
          Download All
        </button>
      </h1>

    </div>
  </div>


  <div class="bs-example" data-example-id="striped-table">
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Company</th>
          <th>File</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>

        {#each data as file, i}
         {#if file.company == 'SHOPIFY'}
          <tr>
            <th scope="row">{i}</th>
            <td>{file.company}</td>
            <td>{file.file}</td>
            <td><a href="./{file.file}" target="_blank" title="Download" class="btn btn-info">Download</a></td>
          </tr>
          {/if}
        {/each}

      </tbody>
    </table>
  </div>

{/await}
