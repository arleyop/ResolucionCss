// Función para ordenar la lista de monedas
private sortCurrencies(currencies: any[]): any[] {
  const priority = ['COP', 'USD', 'EUR'];

  return currencies.sort((a, b) => {
    const aIndex = priority.indexOf(a.cdDiviss);
    const bIndex = priority.indexOf(b.cdDiviss);

    // Si ambos están en la lista de prioridad → respetar orden de priority
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // Si solo a está en prioridad → va primero
    if (aIndex !== -1) return -1;

    // Si solo b está en prioridad → va después
    if (bIndex !== -1) return 1;

    // Ninguno está en prioridad → ordenar alfabéticamente
    return a.cdDiviss.localeCompare(b.cdDiviss);
  });
}



this.simulatorService.getTasas().subscribe({
  next: (data) => {
    this.currencyList = this.sortCurrencies(data);
  },
  error: (err) => {
    console.error('Error cargando tasas:', err);
  }
});
