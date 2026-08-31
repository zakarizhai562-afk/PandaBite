// Shared Tau-Prolog engine wrapper — owned by Person 2.
// Consults a rules string + facts, runs a query, returns plain JS values.
// Used by:
//   - Person 2's Daily Balance Matching Engine (dailyBalanceService.js)
//   - Person 3's Combo Alert service

let plModule = null;

async function loadProlog() {
  if (!plModule) {
    try {
      const mod = await import('tau-prolog');
      plModule = mod.default || mod;
    } catch (e) {
      console.warn('Tau-Prolog failed to load:', e);
      return null;
    }
  }
  return plModule;
}

/**
 * Run a Prolog query against a combined rules+facts source string.
 * @param {string} rulesSource - Prolog source (facts + rules)
 * @param {string} query - Prolog query string (e.g. "combo_type(a, b, Type).")
 * @returns {Record<string, string>|null} - Bound variables as key-value pairs, or null if no answer
 */
export async function runPrologQuery(rulesSource, query) {
  const pl = await loadProlog();
  if (!pl) return null;

  try {
    const session = pl.create();

    let consultOk = false;
    session.consult(rulesSource, {
      success: () => { consultOk = true; },
      error: () => { consultOk = false; },
    });

    if (!consultOk) return null;

    let queryOk = false;
    session.query(query, {
      success: () => { queryOk = true; },
      error: () => { queryOk = false; },
    });

    if (!queryOk) return null;

    let result = null;
    session.answer({
      success: (answer) => {
        const vars = {};
        for (const key in answer.links) {
          vars[key] = session.format_answer(answer.links[key]);
        }
        result = vars;
      },
      fail: () => { result = null; },
      error: () => { result = null; },
      limit: () => { result = null; },
    });

    return result;
  } catch (e) {
    console.warn('Prolog query failed:', e);
    return null;
  }
}
