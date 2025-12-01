/**
 * Clase abstracta base para manejar selecciones con principios SOLID
 * S - Single Responsibility: Solo maneja lógica de selección
 * O - Open/Closed: Extensible para diferentes tipos de selección
 * L - Liskov Substitution: Las implementaciones pueden intercambiarse
 * I - Interface Segregation: Interfaces específicas por tipo
 * D - Dependency Inversion: Depende de abstracciones, no concreciones
 */

export interface SelectionKey {
  toString(): string;
}

export interface SelectionState<T extends SelectionKey> {
  selectedItems: Map<string, boolean>;
}

export abstract class BaseSelectionStore<T extends SelectionKey> {
  protected selections = new Map<string, boolean>();

  /**
   * Método abstracto para generar la key única
   * Cada implementación define su formato específico
   */
  protected abstract generateKey(item: T): string;

  /**
   * Toggle de selección - lógica común
   */
  toggle(item: T): boolean {
    const key = this.generateKey(item);
    const currentValue = this.selections.get(key) || false;
    const newValue = !currentValue;
    this.selections.set(key, newValue);
    return newValue;
  }

  /**
   * Establecer estado de selección
   */
  setSelected(item: T, selected: boolean): void {
    const key = this.generateKey(item);
    this.selections.set(key, selected);
  }

  /**
   * Verificar si está seleccionado
   */
  isSelected(item: T): boolean {
    const key = this.generateKey(item);
    return this.selections.get(key) || false;
  }

  /**
   * Limpiar todas las selecciones
   */
  clearAll(): void {
    this.selections.clear();
  }

  /**
   * Limpiar selecciones que coincidan con un prefijo
   */
  clearByPrefix(prefix: string): void {
    Array.from(this.selections.keys())
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => this.selections.delete(key));
  }

  /**
   * Obtener contador total
   */
  get totalCount(): number {
    return Array.from(this.selections.values()).filter(Boolean).length;
  }

  /**
   * Obtener selecciones que coincidan con un prefijo
   */
  getByPrefix(prefix: string): Array<{ key: string; selected: boolean }> {
    return Array.from(this.selections.entries())
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, selected]) => ({ key, selected }));
  }

  /**
   * Método abstracto para parsear key y obtener datos estructurados
   */
  abstract parseKey(key: string): any;

  /**
   * Obtener todas las selecciones de forma estructurada
   */
  getAllStructured(): any[] {
    return Array.from(this.selections.entries()).map(([key, selected]) => ({
      ...this.parseKey(key),
      selected,
    }));
  }
}
