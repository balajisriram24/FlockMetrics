import { useState, useEffect } from 'react'

const KEY = 'vaccination_records'
const SUGGESTION_KEY = 'medicine_suggestions'

// Vaccine/Medicine database
const VACCINE_TYPES = [
  'Newcastle Disease (ND)',
  'Infectious Bursal Disease (IBD)',
  'Infectious Bronchitis (IB)',
  'Avian Influenza (AI)',
  'Marek\'s Disease',
  'Fowl Pox',
  'Salmonella',
  'E. coli Vaccine',
  'Coccidiosis Vaccine',
  'Vitamin A Supplement',
  'Vitamin B Complex',
  'Calcium Supplement',
  'Probiotics',
]

// Medicine suggestion database
const MEDICINE_DB = [
  { symptom: 'Fever', medicine: 'Paracetamol / Acetaminophen', dosage: '10-15 mg/kg', notes: 'Effective for fever reduction' },
  { symptom: 'Cough', medicine: 'Terramycin / Oxytetracycline', dosage: '50-100 mg/kg', notes: 'Broad-spectrum antibiotic' },
  { symptom: 'Diarrhea', medicine: 'Gatorade / Electrolyte Solution', dosage: 'Ad libitum', notes: 'Rehydration solution' },
  { symptom: 'Respiratory Infection', medicine: 'Enrofloxacin (Baytril)', dosage: '10 mg/kg', notes: 'Fluoroquinolone antibiotic' },
  { symptom: 'Bacterial Infection', medicine: 'Amoxicillin', dosage: '15 mg/kg', notes: 'General bacterial infection' },
  { symptom: 'Vitamin Deficiency', medicine: 'Vitamin B Complex', dosage: 'Follow label', notes: 'Improve immunity' },
  { symptom: 'Worm Infestation', medicine: 'Levamisole', dosage: '5-10 mg/kg', notes: 'Deworming agent' },
  { symptom: 'Wounds/Cuts', medicine: 'Hydrogen Peroxide + Iodine', dosage: 'Topical', notes: 'Disinfection' },
  { symptom: 'Lameness', medicine: 'Vitamin A + Calcium', dosage: 'Follow label', notes: 'Bone health' },
]

export default function Vaccination() {
  const [records, setRecords] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [form, setForm] = useState({ date: '', vaccine: '', dosage: '', mortality: '' })
  const [customVaccine, setCustomVaccine] = useState('')
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)
  const [suggestionForm, setSuggestionForm] = useState({ symptomSearch: '', selectedMedicine: null, selectedSymptoms: [], otherSymptoms: [] })

  // Dosage options for the main vaccination form based on entered vaccine/medicine
  const dosageOptions = (() => {
    const vaccineValue = form.vaccine === '__custom' ? customVaccine : form.vaccine
    if (!vaccineValue) return []
    const matches = MEDICINE_DB.filter(m => m.medicine.toLowerCase().includes(vaccineValue.toLowerCase()))
    // return unique dosages
    return Array.from(new Set(matches.map(m => m.dosage))).filter(Boolean)
  })()
  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) setRecords(JSON.parse(raw))
    
    const rawSuggestions = localStorage.getItem(SUGGESTION_KEY)
    if (rawSuggestions) setSuggestions(JSON.parse(rawSuggestions))
  }, [])

  const save = (next) => { setRecords(next); localStorage.setItem(KEY, JSON.stringify(next)) }
  const saveSuggestions = (next) => { setSuggestions(next); localStorage.setItem(SUGGESTION_KEY, JSON.stringify(next)) }

  const handleAdd = (e) => {
    e.preventDefault()
    const finalVaccine = form.vaccine === '__custom' ? customVaccine.trim() : form.vaccine
    const finalDosage = form.dosage === '__custom' ? (form.customDosage || '') : form.dosage
    if (!finalVaccine) return // Prevent saving without a vaccine
    const entry = { ...form, vaccine: finalVaccine, dosage: finalDosage, date: form.date || new Date().toISOString().split('T')[0] }
    const next = [entry, ...records]
    save(next)
    setForm({ date: '', vaccine: '', dosage: '', mortality: '', customDosage: '' })
    setCustomVaccine('')
  }

  const handleAddSuggestion = (e) => {
    e.preventDefault()
    const chosenSymptoms = [...suggestionForm.selectedSymptoms]
    const otherInputs = (suggestionForm.otherSymptoms || []).map(s => s.trim()).filter(s => s)
    if (otherInputs.length) chosenSymptoms.push(...otherInputs)
    if (chosenSymptoms.length === 0 || suggestionForm.selectedMedicine === null) return

    const medicine = MEDICINE_DB[suggestionForm.selectedMedicine]
    const dateAdded = new Date().toISOString().split('T')[0]
    const entries = chosenSymptoms.map(sym => ({ symptom: sym, medicine: medicine.medicine, dosage: medicine.dosage, notes: medicine.notes, dateAdded }))
    const next = [...entries, ...suggestions]
    saveSuggestions(next)
    setSuggestionForm({ symptomSearch: '', selectedMedicine: null, selectedSymptoms: [], otherSymptoms: [] })
    setShowSuggestionModal(false)
  }

  const filteredMedicines = suggestionForm.symptomSearch
    ? MEDICINE_DB.filter(m => m.symptom.toLowerCase().includes(suggestionForm.symptomSearch.toLowerCase()))
    : MEDICINE_DB

  const uniqueSymptoms = Array.from(new Set(MEDICINE_DB.map(m => m.symptom))).filter(Boolean)

  return (
    <div className="container">
      <h1>Vaccination & Medicine</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div className="card">
          <h3>Record Vaccination</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group">
              <label>Vaccine / Medicine</label>
              <select value={form.vaccine} onChange={(e) => setForm({ ...form, vaccine: e.target.value })}>
                <option value="">-- Select vaccine/medicine --</option>
                {VACCINE_TYPES.map((vt, i) => (<option key={i} value={vt}>{vt}</option>))}
                <option value="__custom">Other</option>
              </select>
              {form.vaccine === '__custom' && (
                <input
                  type="text"
                  placeholder="Enter custom vaccine/medicine"
                  value={customVaccine}
                  onChange={(e) => setCustomVaccine(e.target.value)}
                  style={{ marginTop: 8 }}
                />
              )}
            </div>
            <div className="form-group">
              <label>Dosage</label>
              {dosageOptions.length > 0 ? (
                <>
                  <select value={form.dosage || ''} onChange={(e) => setForm({ ...form, dosage: e.target.value })}>
                    <option value="">-- Select dosage --</option>
                    {dosageOptions.map((d, i) => (<option key={i} value={d}>{d}</option>))}
                    <option value="__custom">Other (specify)</option>
                  </select>
                  {form.dosage === '__custom' && (
                    <input
                      type="text"
                      placeholder="Enter custom dosage"
                      value={form.customDosage || ''}
                      onChange={(e) => setForm({ ...form, customDosage: e.target.value })}
                      style={{ marginTop: 8 }}
                    />
                  )}
                </>
              ) : (
                <select value={form.dosage || ''} onChange={(e) => setForm({ ...form, dosage: e.target.value })}>
                  <option value="">-- Select dosage --</option>
                  <option value="Follow label">Follow label</option>
                  <option value="10 mg/kg">10 mg/kg</option>
                  <option value="15 mg/kg">15 mg/kg</option>
                  <option value="Topical">Topical</option>
                  <option value="Ad libitum">Ad libitum</option>
                  <option value="__custom">Other (specify)</option>
                </select>
              )}
            </div>
            <div className="form-group"><label>Mortality Count</label><input type="number" value={form.mortality} onChange={(e) => setForm({ ...form, mortality: e.target.value })} /></div>
            <button className="btn btn-primary" type="submit">Add</button>
          </form>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSuggestionForm({ symptomSearch: '', selectedMedicine: null, selectedSymptoms: [], otherSymptoms: [] })
              setShowSuggestionModal(true)
            }}
            style={{ marginTop: 12, width: '100%' }}
          >+ Add Suggestion</button>
        </div>

        <div className="card">
          <h3>Records</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Vaccine</th><th>Dosage</th><th>Mortality</th></tr></thead>
              <tbody>
                {records.map((r, i) => (<tr key={i}><td>{r.date}</td><td>{r.vaccine}</td><td>{r.dosage}</td><td>{r.mortality}</td></tr>))}
              </tbody>
            </table>
            {records.length === 0 && <p style={{ padding: 12 }}>No vaccination records yet.</p>}
          </div>
        </div>
      </div>

      {/* Medicine Suggestions Section */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3>Medicine Suggestions by Symptom</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Symptom</th>
                <th>Recommended Medicine</th>
                <th>Dosage</th>
                <th>Notes</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((s, i) => (
                <tr key={i}>
                  <td>{s.symptom}</td>
                  <td>{s.medicine}</td>
                  <td>{s.dosage}</td>
                  <td>{s.notes}</td>
                  <td>{s.dateAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {suggestions.length === 0 && <p style={{ padding: 12 }}>No medicine suggestions yet. Click "Add Suggestion" to get started.</p>}
        </div>
      </div>

      {/* Suggestion Modal */}
      {showSuggestionModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>Add Medicine Suggestion</h3>
            <form onSubmit={handleAddSuggestion}>
              <div className="form-group">
                <label>Problems / Symptoms</label>
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="text"
                    placeholder="Filter symptoms..."
                    value={suggestionForm.symptomSearch}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, symptomSearch: e.target.value })}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                </div>
                <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 4, padding: 8 }}>
                  {uniqueSymptoms.filter(s => s.toLowerCase().includes(suggestionForm.symptomSearch.toLowerCase())).map((sym, idx) => (
                    <label key={idx} style={{ display: 'block', marginBottom: 6 }}>
                      <input
                        type="checkbox"
                        checked={suggestionForm.selectedSymptoms.includes(sym)}
                        onChange={(e) => {
                          const set = new Set(suggestionForm.selectedSymptoms)
                          if (e.target.checked) set.add(sym)
                          else set.delete(sym)
                          setSuggestionForm({ ...suggestionForm, selectedSymptoms: Array.from(set) })
                        }}
                        style={{ marginRight: 8 }}
                      />
                      {sym}
                    </label>
                  ))}
                  <div style={{ marginTop: 8 }}>
                    <label style={{ display: 'block' }}>
                      <input
                        type="checkbox"
                        checked={(suggestionForm.otherSymptoms || []).length > 0}
                        onChange={(e) => setSuggestionForm({ ...suggestionForm, otherSymptoms: e.target.checked ? [''] : [] })}
                        style={{ marginRight: 8 }}
                      />
                      Other
                    </label>

                    {(suggestionForm.otherSymptoms || []).length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        {(suggestionForm.otherSymptoms || []).map((val, oi) => (
                          <div key={oi} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                            <input
                              type="text"
                              placeholder={`Custom problem ${oi + 1}`}
                              value={val}
                              onChange={(e) => {
                                const arr = [...(suggestionForm.otherSymptoms || [])]
                                arr[oi] = e.target.value
                                setSuggestionForm({ ...suggestionForm, otherSymptoms: arr })
                              }}
                              style={{ flex: 1 }}
                            />
                            <button type="button" className="btn btn-secondary" onClick={() => {
                              const arr = [...(suggestionForm.otherSymptoms || [])]
                              arr.splice(oi, 1)
                              setSuggestionForm({ ...suggestionForm, otherSymptoms: arr })
                            }}>Remove</button>
                          </div>
                        ))}
                        <button type="button" className="btn btn-primary" onClick={() => setSuggestionForm({ ...suggestionForm, otherSymptoms: [...(suggestionForm.otherSymptoms || []), ''] })}>Add another</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {(suggestionForm.selectedSymptoms.length > 0 || ((suggestionForm.otherSymptoms || []).some(s => s && s.trim()))) && filteredMedicines.length > 0 && (
                <div className="form-group">
                  <label>Select Medicine</label>
                  <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 4, padding: 8 }}>
                    {filteredMedicines.map((med, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSuggestionForm({ ...suggestionForm, selectedMedicine: MEDICINE_DB.indexOf(med) })}
                        style={{
                          padding: 10,
                          marginBottom: 8,
                          backgroundColor: suggestionForm.selectedMedicine === MEDICINE_DB.indexOf(med) ? '#e3f2fd' : '#f5f5f5',
                          border: suggestionForm.selectedMedicine === MEDICINE_DB.indexOf(med) ? '2px solid #2196F3' : '1px solid #ddd',
                          borderRadius: 4,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <strong>{med.medicine}</strong>
                        <div style={{ fontSize: 12, color: '#666' }}>Dosage: {med.dosage}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>Notes: {med.notes}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(suggestionForm.selectedSymptoms.length > 0 || ((suggestionForm.otherSymptoms || []).some(s => s && s.trim()))) && filteredMedicines.length === 0 && (
                <p style={{ color: '#f44336', fontSize: 14 }}>No matching medicines found. Please use a symptom from the suggestions.</p>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={(suggestionForm.selectedSymptoms.length === 0 && !((suggestionForm.otherSymptoms || []).some(s => s && s.trim()))) || suggestionForm.selectedMedicine === null}>
                  Add Suggestion
                </button>
                  <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowSuggestionModal(false)
                    setSuggestionForm({ symptomSearch: '', selectedMedicine: null, selectedSymptoms: [], otherSymptoms: [] })
                  }}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
