import Header from '~/components/Layouts/components/Header';
import Footer from '~/components/Layouts/components/Footer';

function DefaultLayout({ children }) {
    return (
        <>
            <Header />
            <div className="content">
                {children}
            </div>
            <Footer />
        </>
    )
}

export default DefaultLayout;