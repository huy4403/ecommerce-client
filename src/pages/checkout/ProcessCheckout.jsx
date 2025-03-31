import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function ProcessCheckout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const orderId = searchParams.get('orderId');
        const status = searchParams.get('status');

        if (orderId && (status === 'success' || status === 'failed')) {
            navigate(`/order/result/${orderId}`, {
                state: { isCheckout: true, status: status, replace: true }
            });
        }
    }, [searchParams, navigate]);
}

export default ProcessCheckout;
