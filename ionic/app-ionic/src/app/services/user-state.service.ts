import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BonoService } from './bono';
import { AuthService } from './auth.service';

/**
 * 🔥 Servicio para gestionar el estado global de la aplicación
 * 
 * Este servicio es CRÍTICO para que el menú y las páginas se actualicen
 * automáticamente sin necesidad de recargar (F5)
 */
@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  // 🔥 BehaviorSubject mantiene el último valor emitido
  // y permite a múltiples componentes suscribirse a cambios
  private bonoSubject = new BehaviorSubject<any>(null);
  
  // 🔥 Observable público que los componentes pueden suscribirse
  public bono$: Observable<any> = this.bonoSubject.asObservable();

  constructor(
    private bonoService: BonoService,
    private auth: AuthService
  ) {}

  /**
   * 🔥 Carga el bono del usuario actual desde el servidor
   * y actualiza el estado global
   */
    private bonoCargado = false;

loadBono() {

  if (this.bonoCargado) return;

  const user = this.auth.getUser();

  if (!user || user.rol !== 'cliente') {
    this.bonoSubject.next(null);
    return;
  }

  this.bonoCargado = true;

  this.bonoService.getBonoActivo(user.id_usuario)
    .subscribe({
      next: bono => this.bonoSubject.next(bono),
      error: () => this.bonoSubject.next(null)
    });
}





  /**
   * 🔥 Establece manualmente el bono en el estado global
   * Útil cuando ya tenemos el bono y queremos actualizar el estado
   */
  setBono(bono: any) {
    this.bonoSubject.next(bono);
  }

  /**
   * 🔥 Obtiene el valor actual del bono de forma síncrona
   * Sin suscribirse al observable
   */
  getBonoActual(): any {
    return this.bonoSubject.value;
  }

  /**
   * 🔥 Alias de loadBono() para compatibilidad
   * Refresca el bono desde el servidor
   */
  refreshBono() {
    this.loadBono();
  }

  /**
   * 🔥 Limpia todo el estado (útil al hacer logout)
   */
  clear() {
  this.bonoCargado = false;
  this.bonoSubject.next(null);
}
}