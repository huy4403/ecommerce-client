import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import CustomerRoutes from '~/routes/CustomerRoutes'
import AdminRoutes from '~/routes/AdminRoutes'
import { DefaultLayout } from '~/components/Layouts'
import { Fragment } from 'react'

function App() {

  const routes = [...CustomerRoutes, ...AdminRoutes];

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => {

          const Page = route.component

          let Layout = DefaultLayout

          if (route.layout) {
            Layout = route.layout
          } else if (route.layout === null) {
            Layout = Fragment
          }

          return (
            <Route key={index} path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  )
}

export default App
