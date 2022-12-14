// @ts-nocheck
import { formatMoney } from 'common/common';
import { getFromLocal, resetItemInLocal } from 'common/local-storage';
import Button from 'components/Button';
import Helmet from 'components/Helmet';
import { BASE_URL, ROOT_URL } from 'constant/config';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrders } from 'redux/actions/order.actions';
import numberWithCommas from 'utils/numberWithCommas';

const Checkout = () => {
	const [products, setProducts] = useState();
	const dispatch = useDispatch();
	const [status, setStatus] = useState(0);
	const [fullname, setFullname] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [email, setEmail] = useState('');
	const [gender, setGender] = useState('');
	const [user, setUser] = useState();
	const history = useHistory();
	useEffect(() => {
		setUser(JSON.parse(localStorage.getItem('user')));
	}, []);
	// const [information, setInformation] = useState({
	// 	fullname: '',
	// 	phone: '',
	// 	address: '',
	// 	gender: '',
	// 	isGender: false,
	// 	isFullname: false,
	// 	isPhone: false,
	// 	isAddress: false,
	// });
	useEffect(() => {
		setProducts(getFromLocal('cart'));
	}, []);
	const totalPrice = numberWithCommas(
		getFromLocal('cart').reduce(
			(total, item) =>
				total +
				parseInt(item.product.price) * parseInt(item.version.currentQuantity),
			0,
		),
	);
	const handleCheckout = async () => {
		const dataSubmit = {};
		dataSubmit.phone = phone;
		dataSubmit.fullname = fullname;
		dataSubmit.address = address;
		dataSubmit.email = email;
		dataSubmit.gender = +gender;
		dataSubmit.products = getFromLocal('cart').map((e) => ({
			productId: e.product?.id,
			productVersionId: e.version?.id,
			quantity: e.version?.currentQuantity,
		}));
		const response = await fetch(`${BASE_URL}orders/checkout-public`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataSubmit),
		});
		const data = await response.json();
		if (data.statusCode === 201) {
			toast.success(data.message);
			resetItemInLocal();
			setStatus(1);
		} else {
			toast.error(data.message);
		}
	};

	const handleSubmit = () => {
		const params = {
			fullname: fullname,
			phone: phone,
			address: address,
			email: email,
			gender: +gender,
			products: getFromLocal('cart')?.map((e) => ({
				productId: e.product?.id,
				productVersionId: e.version?.id,
				quantity: e.version?.currentQuantity,
			})),
		};
		dispatch(
			createOrders(params, () => {
				setStatus(1);
				localStorage.removeItem('cart');
				toast.success('?????t h??ng th??nh c??ng');
				history.push('/');
			}),
		);
	};
	return (
		<Helmet title='Thanh to??n'>
			<div className='checkout grid'>
				<div className='row wide'>
					<div className='col l-4 m-12 c-12 checkout__column__item'>
						<h1 className='checkout__column__item__heading'>
							Th??ng tin h??a ????n
						</h1>
						<div className='checkout__column__item__form'>
							<form action=''>
								<div className='checkout__column__item__form__group'>
									<label htmlFor=''>H??? v?? t??n</label>
									<input
										type='text'
										name=''
										id=''
										value={fullname}
										onChange={(e) => setFullname(e.target.value)}
									/>
								</div>
								<div className='checkout__column__item__form__group'>
									<div className='row'>
										<div className='col l-6 m-12 checkout__column__item__form__group__item'>
											<label htmlFor=''>Email</label>
											<input
												type='email'
												name=''
												id=''
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
										</div>
										<div className='col l-6 m-12 checkout__column__item__form__group__item'>
											<label htmlFor=''>??i???n tho???i</label>
											<input
												type='tel'
												name=''
												id=''
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
											/>
										</div>
									</div>
								</div>
								<div className='l-12 m-12 c-12 checkout__column__item__form__group'>
									<label htmlFor=''>?????a Ch???</label>
									<input
										type='text'
										name=''
										id=''
										value={address}
										onChange={(e) => setAddress(e.target.value)}
									/>
								</div>
								<div className='user__content__info__form__group'>
									<label htmlFor=''>Gi???i t??nh</label>
									<select
										name='select'
										id=''
										value={gender}
										onChange={(e) => {
											setGender(e.target.value);
										}}
									>
										<option value='' disabled selected>
											Gi???i t??nh
										</option>
										<option value={0}>Nam</option>
										<option value={1}>N???</option>
									</select>
								</div>
								<div className='checkout__column__item__form__group'>
									<label htmlFor=''>Ghi ch?? ????n h??ng</label>
									<textarea></textarea>
								</div>
							</form>
						</div>
					</div>
					<div className='col l-4 c-12 checkout__column__item'>
						<h1 className='checkout__column__item__heading'>
							Ph????ng th???c thanh to??n
						</h1>
						<div className='checkout__column__item__payment'>
							<input type='checkbox' name='' id='' />
							<span>Thanh to??n ti???n m???t khi nh???n h??ng (COD)</span>
						</div>
					</div>
					<div className='col l-4 c-12 checkout__column__item'>
						<h1 className='checkout__column__item__heading'>
							Th??ng tin gi??? h??ng
						</h1>
						<div className='checkout__column__item__table'>
							<div className='table__header'>
								<div className='row'>
									<div className='col l-3 c-3 table__header__item'>
										H??nh ???nh
									</div>
									<div className='col l-3 c-3 table__header__item'>
										T??n s???n ph???m
									</div>
									<div className='col l-3 c-3 table__header__item'>
										S??? l?????ng
									</div>
									<div className='col l-3 c-3 table__header__item'>Gi??</div>
								</div>
							</div>
							{products
								? products?.map((item, index) => (
										<div className='table__item' key={index}>
											<div className='col l-3 c-3 table__item__image'>
												<img
													src={`${ROOT_URL}/${item?.product?.productImages[0]?.url}`}
													alt=''
												/>
											</div>
											<div className='col l-9 c-9 table__item__info'>
												<div className='col l-4 c-4 table__item__info__name'>
													<h4>{item?.product?.name}</h4>
												</div>
												<div className=' col l-2 c-2 table__item__info__quantity'>
													<h4>{item?.version?.currentQuantity}</h4>
												</div>
												<div className=' col l-3 c-3 able__item__info__price'>
													<h4>
														{item?.product?.salePrice
															? formatMoney(item?.product?.salePrice)
															: formatMoney(item?.product?.price)}{' '}
													</h4>
												</div>
											</div>
										</div>
								  ))
								: ''}
							<div className='payment'>
								<div className='payment__item'>
									<div className='col l-6 c-6 payment__item__title'>
										<h4>T???m t??nh</h4>
									</div>
									<div className='col l-6 c-6 payment__item__price'>
										<h4>{totalPrice} VND</h4>
									</div>
								</div>
								<div className='payment__item'>
									<div className='col l-6 c-6 payment__item__title'>
										<h4>Ph?? v???n chuy???n(To??n qu???c)</h4>
									</div>
									<div className='col l-6 c-6 payment__item__price'>
										<h4>Free</h4>
									</div>
								</div>
								<div className='payment__item'>
									<div className='col l-6 c-6 payment__item__title'>
										<h4>T???ng c???ng</h4>
									</div>
									<div className='col l-6 c-6 payment__item__price'>
										<h4>{totalPrice} VND</h4>
									</div>
								</div>
							</div>
							<div className='button__group'>
								<Button className='button__group__item' size='block'>
									Ti???p t???c mua h??ng
								</Button>
								<Button
									className='button__group__item'
									size='block'
									onClick={handleSubmit}
								>
									?????t h??ng
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Helmet>
	);
};

export default Checkout;
