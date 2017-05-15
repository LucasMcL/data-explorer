app.factory('HomeFact', function() {
	console.log('home factory instantiated')

	 /**
   * given row of dataset as strings, determine
   * if any data are actually numbers or booleans
   * @param  {Object} row - first row of dataset as object of strings
   * @return {Array} - array of objects [header: <header>, type: 'string' | 'boolean' | 'number']
   */
  function determineVarTypes(row) {
    let types = []
    for(header in row) {
      type = 'string'
      const datum = row[header]
      if(datum === "true" || datum === "false") type = 'boolean'
      if(!isNaN(datum)) type = 'number'
      types.push({header, type})
    }
    return types
  }

  /**
   * takes data in string format and attempts to
   * convert numbers and booleans to their appropriate values
   * @param  {Array} rows - Array of objects of strings
   * @return {Array} - Array of objects of mixed
   */
  function convertData(rows) {
    let types = determineVarTypes(rows[0])
    for(let i = 0; i < rows.length; i++) {
      for(let j = 0; j < types.length; j++) {
        let typeObj = types[j]
        let header = typeObj.header; let type = typeObj.type
        if(type === 'number') rows[i][header] = Number(rows[i][header])
        if(type.type === 'boolean') {
          if (rows[i][header] === "true") rows[i][header] = true
          if (rows[i][header] === "false") rows[i][header] = false
        }
      }
    }
    return rows
  }

	return { convertData }
})
