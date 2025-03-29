import { createContext, useState } from 'react';

const Context = createContext();

function ContextProvider({ children }) {

    const [cartCount, setCartCount] = useState(0);
    const [categorySelected, setCategorySelected] = useState('');
    const [keyword, setKeyword] = useState('');

    const [isLogin, setIsLogin] = useState(null);


    const value = {
        cartCount,
        setCartCount,
        categorySelected,
        setCategorySelected,
        keyword,
        setKeyword,
        isLogin,
        setIsLogin
    }

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export { Context, ContextProvider };
