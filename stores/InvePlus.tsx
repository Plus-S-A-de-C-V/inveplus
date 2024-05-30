import { useEffect } from "react";
import { Usuario, Product, Supplier, Check } from "../lib/definitions";
import { create, StateCreator, createStore } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'

interface UsersSlice {
    users: Usuario[];
    loadingUsers: boolean;
    usersInitialzed: boolean;
    initializeUsers: () => void;
    addUser: (user: Usuario) => void;
    updateUser: (user: Usuario) => void;
    deleteUser: (id: string) => void;

    forceUpdateUsers: () => void;
}

interface ProductsSlice {
    products: Product[];
    loadingProducts: boolean;
    productsInitialized: boolean;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;

    forceUpdateProducts: () => void;
}

interface SuppliersSlice {
    suppliers: Supplier[];
    loadingSuppliers: boolean;
    suppliersInitialized: boolean;
    addSupplier: (supplier: Supplier) => void;
    updateSupplier: (supplier: Supplier) => void;
    deleteSupplier: (id: string) => void;

    forceUpdateSuppliers: () => void;
}

interface ChecksSlice {
    checks: Check[];
    loadingChecks: boolean;
    checksInitialized: boolean;
    addCheck: (check: Check) => void;
    updateCheck: (check: Check) => void;
    deleteCheck: (id: string) => void;

    forceUpdateChecks: () => void;
}

const createUserSlice: StateCreator<UsersSlice> = (set) => ({
    users: [],
    loadingUsers: true,
    usersInitialzed: false,
    initializeUsers: () => {
        set({ usersInitialzed: true, loadingUsers: false });
    },
    addUser: (user) => set(state => ({ users: [...state.users, user] })),
    updateUser: (user) => set(state => ({ users: state.users.map(u => u.id === user.id ? user : u) })),
    deleteUser: (id) => set(state => ({ users: state.users.filter(u => u.id !== id) })),
    forceUpdateUsers: async () => {
        set({ loadingUsers: true });
        const _users = await fetch("/api/users").then((res) => res.json());
        set({ users: _users, loadingUsers: false });
    }
});

const createProductSlice: StateCreator<ProductsSlice> = (set) => ({
    products: [],
    loadingProducts: true,
    productsInitialized: false,
    addProduct: (product) => set(state => ({ products: [...state.products, product] })),
    updateProduct: (product) => set(state => ({ products: state.products.map(p => p.ProductID === product.ProductID ? product : p) })),
    deleteProduct: (id) => set(state => ({ products: state.products.filter(p => p.ProductID !== id) })),
    forceUpdateProducts: async () => {
        set({ loadingProducts: true });
        const _products = await fetch("/api/products").then((res) => res.json());
        set({ products: _products, loadingProducts: false });
    }
});

const createSupplierSlice: StateCreator<SuppliersSlice> = (set) => ({
    suppliers: [],
    loadingSuppliers: true,
    suppliersInitialized: false,
    addSupplier: (supplier) => set(state => ({ suppliers: [...state.suppliers, supplier] })),
    updateSupplier: (supplier) => set(state => ({ suppliers: state.suppliers.map(s => s.SupplierID === supplier.SupplierID ? supplier : s) })),
    deleteSupplier: (id) => set(state => ({ suppliers: state.suppliers.filter(s => s.SupplierID !== id) })),
    forceUpdateSuppliers: async () => {
        set({ loadingSuppliers: true });
        const _suppliers = await fetch("/api/suppliers").then((res) => res.json());
        set({ suppliers: _suppliers, loadingSuppliers: false });
    }
});

const createCheckSlice: StateCreator<ChecksSlice> = (set) => ({
    checks: [],
    loadingChecks: true,
    checksInitialized: false,
    addCheck: (check) => set(state => ({ checks: [...state.checks, check] })),
    updateCheck: (check) => set(state => ({ checks: state.checks.map(c => c.id === check.id ? check : c) })),
    deleteCheck: (id) => set(state => ({ checks: state.checks.filter(c => c.id !== id) })),
    forceUpdateChecks: async () => {
        set({ loadingChecks: true });
        const _checks = await fetch("/api/checks").then((res) => res.json());
        set({ checks: _checks, loadingChecks: false });
    }
});

const useUsersStore = create(createUserSlice);
const useProductsStore = create(createProductSlice);
const useSuppliersStore = create(createSupplierSlice);
const useChecksStore = create(createCheckSlice);

export { useUsersStore, useProductsStore, useSuppliersStore, useChecksStore };