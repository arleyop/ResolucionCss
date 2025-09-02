this.tasas = response.sort((a, b) => {
  const priority = ['COP', 'USD', 'EUR'];

  const indexA = priority.indexOf(a.cdDiviss);
  const indexB = priority.indexOf(b.cdDiviss);

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB; // Si ambos están en la lista de prioridad → respeta ese orden
  } else if (indexA !== -1) {
    return -1; // a es prioritario
  } else if (indexB !== -1) {
    return 1; // b es prioritario
  } else {
    return a.cdDiviss.localeCompare(b.cdDiviss); // resto en orden alfabético
  }
});
