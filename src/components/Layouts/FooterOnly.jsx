import Header from '~/components/Layouts/components/Header';
import Footer from '~/components/Layouts/components/Footer';

function DefaultLayout({ children }) {
    return (
        <div>
            <div className="container">
                <div className="content">
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default DefaultLayout;