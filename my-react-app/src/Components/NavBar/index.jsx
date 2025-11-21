
import './navbar.scss';
import { FiHome, FiUser } from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const Index = () => {
    const navigate = useNavigate();
    return (
        <div className="bottom-navbar">
            <ul className="bottom-navbar__menu">
                <li className="bottom-navbar__item" onClick={() => navigate("/Webpage")}><FiHome /></li>
                <li className="bottom-navbar__item" onClick={() => navigate("/Seller-page")}><MdStorefront /></li>
                <li className="bottom-navbar__item" onClick={() => navigate("/Buyer-page")}><FaUserFriends /></li>
                <li className="bottom-navbar__item" onClick={() => navigate("/profile-page")}><FiUser /></li>
            </ul>
        </div>
    );
}

export default Index;
