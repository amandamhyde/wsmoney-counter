import { useState, useEffect } from 'react'
// import wake lock hook
import { useWakeLock } from 'react-screen-wake-lock'

function App() {
  // screen wake lock functionality
  const { isSupported, isLocked, request, release } = useWakeLock({
    onError: (error) => console.log('Wake lock error:', error)
  })

  // state for bills and coins all starting at 0
  const [bills, setBills] = useState({
    hundred: 0, fifty: 0, twenty: 0, ten: 0, five: 0, two: 0, one: 0
  })
  
  const [coins, setCoins] = useState({
    dollar: 0, fiftyCents: 0, quarter: 0, dime: 0, nickel: 0, penny: 0
  })

  // currency formatter function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  // load saved data when app starts
  useEffect(() => {
    const savedBills = localStorage.getItem('bills')
    const savedCoins = localStorage.getItem('coins')
    if (savedBills) setBills(JSON.parse(savedBills))
    if (savedCoins) setCoins(JSON.parse(savedCoins))
  }, [])

  // request wake lock when app mounts, release when unmounts
  useEffect(() => {
    // check if browser supports wake lock
    if (isSupported) {
      request()
    }
    
    // cleanup function - releases wake lock when component unmounts
    return () => {
      if (isSupported) {
        release()
      }
    }
  }, [isSupported, request, release])

  // save data whenever bills or coins change
  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills))
  }, [bills])

  useEffect(() => {
    localStorage.setItem('coins', JSON.stringify(coins))
  }, [coins])

  // handle number input changes
  const handleBillChange = (type, value) => {
    const numValue = value === '' ? 0 : parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 0) {
      setBills(prev => ({ ...prev, [type]: numValue }))
    }
  }

  const handleCoinChange = (type, value) => {
    const numValue = value === '' ? 0 : parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 0) {
      setCoins(prev => ({ ...prev, [type]: numValue }))
    }
  }

  // calculate total
  const calculateTotal = () => {
    const billTotal = 
      bills.hundred * 100 +
      bills.fifty * 50 +
      bills.twenty * 20 +
      bills.ten * 10 +
      bills.five * 5 +
      bills.two * 2 +
      bills.one * 1

    const coinTotal =
      coins.dollar * 1 +
      coins.fiftyCents * 0.50 +
      coins.quarter * 0.25 +
      coins.dime * 0.10 +
      coins.nickel * 0.05 +
      coins.penny * 0.01

    return billTotal + coinTotal
  }

  // reset all values
  const resetAll = () => {
    if (window.confirm('Are you sure you want to reset all counts?')) {
      setBills({
        hundred: 0, fifty: 0, twenty: 0, ten: 0, five: 0, two: 0, one: 0
      })
      setCoins({
        dollar: 0, fiftyCents: 0, quarter: 0, dime: 0, nickel: 0, penny: 0
      })
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>💰 Money Counter</h1>

      {/* bills section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Bills</h2>
        <div style={styles.inputGrid}>
          <InputField 
            label="$100" 
            value={bills.hundred}
            onChange={(val) => handleBillChange('hundred', val)}
            subtotal={bills.hundred * 100}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="$50" 
            value={bills.fifty}
            onChange={(val) => handleBillChange('fifty', val)}
            subtotal={bills.fifty * 50}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="$20" 
            value={bills.twenty}
            onChange={(val) => handleBillChange('twenty', val)}
            subtotal={bills.twenty * 20}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="$10" 
            value={bills.ten}
            onChange={(val) => handleBillChange('ten', val)}
            subtotal={bills.ten * 10}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="$5" 
            value={bills.five}
            onChange={(val) => handleBillChange('five', val)}
            subtotal={bills.five * 5}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="$2" 
            value={bills.two}
            onChange={(val) => handleBillChange('two', val)}
            subtotal={bills.two * 2}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="$1" 
            value={bills.one}
            onChange={(val) => handleBillChange('one', val)}
            subtotal={bills.one * 1}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>

      {/* coins section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Coins</h2>
        <div style={styles.inputGrid}>
          <InputField 
            label="$1" 
            value={coins.dollar}
            onChange={(val) => handleCoinChange('dollar', val)}
            subtotal={coins.dollar * 1}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="50¢" 
            value={coins.fiftyCents}
            onChange={(val) => handleCoinChange('fiftyCents', val)}
            subtotal={coins.fiftyCents * 0.50}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="25¢" 
            value={coins.quarter}
            onChange={(val) => handleCoinChange('quarter', val)}
            subtotal={coins.quarter * 0.25}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="10¢" 
            value={coins.dime}
            onChange={(val) => handleCoinChange('dime', val)}
            subtotal={coins.dime * 0.10}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="5¢" 
            value={coins.nickel}
            onChange={(val) => handleCoinChange('nickel', val)}
            subtotal={coins.nickel * 0.05}
            formatCurrency={formatCurrency}
          />
          <InputField 
            label="1¢" 
            value={coins.penny}
            onChange={(val) => handleCoinChange('penny', val)}
            subtotal={coins.penny * 0.01}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>

      {/* total display */}
      <div style={styles.totalContainer}>
        <h2 style={styles.totalText}>
          Total: {formatCurrency(calculateTotal())}
        </h2>
      </div>

      {/* reset button */}
      <div style={styles.buttonContainer}>
        <button 
          style={styles.resetButton}
          onClick={resetAll}
        >
          Reset All
        </button>
      </div>
    </div>
  )
}

// custom input component
function InputField({ label, value, onChange, subtotal, formatCurrency }) {
  return (
    <div style={inputStyles.container}>
      <label style={inputStyles.label}>{label}</label>
      <input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        value={value === 0 ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        style={inputStyles.input}
      />
      {formatCurrency && (
        <div style={inputStyles.subtotal}>
          {formatCurrency(subtotal || 0)}
        </div>
      )}
    </div>
  )
}

// styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '32px',
    marginBottom: '30px',
    fontWeight: '600',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    color: '#2c3e50',
    fontSize: '24px',
    marginBottom: '20px',
    borderBottom: '3px solid #3498db',
    paddingBottom: '10px',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '15px',
  },
  totalContainer: {
    backgroundColor: '#27ae60',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '30px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  totalText: {
    color: 'white',
    fontSize: '28px',
    margin: 0,
    fontWeight: '600',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  resetButton: {
    width: '100%',
    maxWidth: '300px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '18px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(231, 76, 60, 0.3)',
    transition: 'transform 0.1s, box-shadow 0.1s',
  }
}

const inputStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#34495e',
  },
  input: {
    padding: '12px',
    fontSize: '18px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#f8f9fa',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  subtotal: {
    fontSize: '14px',
    color: '#27ae60',
    fontWeight: '600',
    textAlign: 'right',
    marginTop: '2px',
  }
}

export default App