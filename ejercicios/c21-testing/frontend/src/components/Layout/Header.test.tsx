import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { AuthContext } from '../../context/AuthContext';
import type { Rol, Usuario } from '../../types/auth';

// El Header según el rol: la columna "Qué hace la UI" de la matriz de C20.
// Header usa useNavigate (router) y useAuth (context): le damos un router en
// memoria y una sesión FALSA, sin back ni token. Eso es un mock.
function renderHeader(usuario: Usuario | null, { cargando = false } = {}) {
  const auth = {
    usuario,
    cargando,
    estaAutenticado: usuario !== null,
    tieneRol: (rol: Rol) => usuario?.rol === rol,
    login: vi.fn(),
    logout: vi.fn(),
  };
  render(
    <MemoryRouter>
      <AuthContext.Provider value={auth}>
        <Header />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
  return auth;
}

const cliente: Usuario = { id: 2, email: 'cliente@libreria.test', nombre: 'Cliente', rol: 'CLIENTE' };
const admin: Usuario = { id: 1, email: 'admin@libreria.test', nombre: 'Admin', rol: 'ADMIN' };

describe('Header', () => {
  it('sin sesión: muestra "Ingresar" y NO ve "Nuevo libro"', () => {
    renderHeader(null);
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.queryByText('Nuevo libro')).not.toBeInTheDocument();
    expect(screen.queryByText(/Hola/)).not.toBeInTheDocument();
  });

  it('CLIENTE: saluda por nombre, muestra "Salir" y NO ve "Nuevo libro"', () => {
    renderHeader(cliente);
    expect(screen.getByText('Hola, Cliente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salir' })).toBeInTheDocument();
    expect(screen.queryByText('Nuevo libro')).not.toBeInTheDocument();
  });

  it('ADMIN: ve el link "Nuevo libro" que lleva a /libros/nuevo', () => {
    renderHeader(admin);
    expect(screen.getByText('Hola, Admin')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Nuevo libro' })).toHaveAttribute('href', '/libros/nuevo');
  });

  it('mientras cargando: no muestra ni "Ingresar" ni "Salir" (todavía no sabe quién sos)', () => {
    renderHeader(null, { cargando: true });
    expect(screen.queryByRole('button', { name: 'Ingresar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Salir' })).not.toBeInTheDocument();
  });

  it('click en "Salir" llama a logout del context', () => {
    const auth = renderHeader(cliente);
    fireEvent.click(screen.getByRole('button', { name: 'Salir' }));
    expect(auth.logout).toHaveBeenCalledTimes(1);
  });
});
