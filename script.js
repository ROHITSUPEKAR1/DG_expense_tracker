document.getElementById('transaction-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const client = document.getElementById('client').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const date = document.getElementById('date').value;

  await fetch('http://localhost:3000/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client, amount, type, date })
  });

  loadTransactions();
  e.target.reset();
});

async function loadTransactions() {
  const start = document.getElementById('start-date').value;
  const end = document.getElementById('end-date').value;
  let url = 'http://localhost:3000/api/transactions';
  if (start && end) {
    url += `?start=${start}&end=${end}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  const list = document.getElementById('transaction-list');
  list.innerHTML = '';
  let balance = 0;

  data.forEach((t) => {
    const li = document.createElement('li');
    li.className = t.type;
    li.textContent = `${t.created_at} - ${t.client}: ₹${t.amount} (${t.type})`;
    list.appendChild(li);

    const amt = parseFloat(t.amount) || 0;
    balance += t.type === 'credit' ? amt : -amt;
  });

  document.getElementById('balance').textContent = `Balance: ₹${balance.toFixed(2)}`;
}

loadTransactions();
