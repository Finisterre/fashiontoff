<script>
  import { afterUpdate } from "svelte";

  var CountryRatesArray;
  let FTdata;
  let comp;

  let visible = true;

  var CountryRatesArray = getCountryRates();

  afterUpdate(() => {
    CountryRatesArray = getCountryRates();
  });

  async function getCountryRates() {
    let rpta = [];
    const res = await fetch("http://159.89.36.186:1337/countryRates");

    const countryRates = await res.json();

    console.log(countryRates);

    return countryRates;
  }

  async function updateData(i){

     let ENVIO = document.getElementById(i+'_ENVIO').value;
     let COMISION = document.getElementById(i+'_COMISION').value;
     let COTIZACION = document.getElementById(i+'_COTIZACION').value;
     let id = document.getElementById(i+'_id').value;
     console.log(ENVIO)
      console.log(COTIZACION)
       console.log(COMISION)

             const update = await fetch(
        "http://159.89.36.186:1337/countryRates/" + id,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            rates: {
                "COTIZACION": COTIZACION,
                "COMISION": COMISION,
                "ENVIO": ENVIO
                }
          })
        }
      );

      var response = await update.json();

      CountryRatesArray = getCountryRates();

  }
</script>

<h3 id="title">Country Rates</h3>
<div class="row">

  {#await CountryRatesArray}
    loading......
  {:then CountryRates}
    {#if visible}
      <div class="col-md-12">

        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Country</th>
              <th>Margin (comision)</th>
              <th>Ship (envio)</th>
              <th>Quote (cotizacion)</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {#each CountryRates as rate, i}
              <tr>
                <td>{i}</td>
                <td>{rate.countryName}</td>
                <input type="hidden" id="{i}_id" value="{rate.id}">
                  <td>
                    <input
                      type="text"
                      id="{i}_COMISION"
                      value={rate.rates.COMISION} />

                  </td>
                  <td>
                    <input
                      type="text"
                      id="{i}_ENVIO"
                      value={rate.rates.ENVIO} />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="{i}_COTIZACION"
                      value={rate.rates.COTIZACION} />
                  </td>
                  <td>
                      <button
                        type="button"
                        class="btn btn-info"
                        id="EDIT{i}"
                        on:click={() => updateData(i)}>
                        Update
                    </button>
                  
                  </td>
              </tr>
            {/each}
          </tbody>
        </table>

      </div>
    {/if}
  {/await}
</div>
