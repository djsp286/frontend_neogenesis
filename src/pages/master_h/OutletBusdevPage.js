import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import * as api from './api';
import ReactDOM from 'react-dom';
import Typography from 'components/Typography';
import { Redirect } from 'react-router';
import {
	Alert,
	Button,
	Badge,
	Card,
	CardBody,
	CardHeader,
	Col,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Input,
	InputGroup,
	InputGroupAddon,
	ListGroup,
	ListGroupItem,
	Form,
	FormGroup,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
	UncontrolledDropdown,
	UncontrolledTooltip
} from 'reactstrap';
import {
	MdSearch,
	MdLoyalty,
	MdFormatAlignRight,
	MdPermContactCalendar,
	MdInfo,
	MdAdd,
	MdExpandMore,
} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import DropdownPage from '../template/DropdownPage';
import { ENGINE_METHOD_NONE } from 'constants';
import { Route, NavLink } from 'react-router-dom';
import OutletPage from './OutletPage';

const hostUrl = 'https://api.docnet.id/CHCMasterH/MasterOutlet'

class BusdevPage extends React.Component {

	//Method constructor
	constructor(props) {
		super(props);
		this.state = {

			isLoading: false,

			// Button Disabled Status
			buttonAddDisabled: true,
			buttonEditDisabled: true,
			buttonDetailDisabled: true,
			buttonSearchDisabled: false,
			sewaKembaliDisabled: true,

			// Data depan m_sewa_outlet
			outletSearchInput: '',
			outletList: [],
			cariOutcodeInput: '',
			sewaout_runningid: '',
			sewaout_outcode: '',
			out_name: '',
			tanggal_buka: '',

			//Data Pemilik Lokasi m_sewa_outlet
			sewaout_namapemlok: '',
			sewaout_grouppemlok: 0,
			groupPemlokText: '',
			groupPemlokDropdownOpen: false,
			sewaout_phonepemlok: '',
			sewaout_namacp1: '',
			sewaout_jabatancp1: '',
			sewaout_phonecp1: '',
			sewaout_tanggallahir1: '1900-01-01',
			sewaout_namacp2: '',
			sewaout_jabatancp2: '',
			sewaout_phonecp2: '',
			sewaout_tanggallahir2: '1900-01-01',

			sewaout_bast: '',
			bast1: '',
			bast2: '',
			bast3: '',
			bast4: '',

			// Data Sewa Periode m_sewa_outlet
			mulai_sewa: '',
			selesai_sewa: '',
			jangka_sewa: '',
			notice_letter: '',
			sewaout_warning: '',
			sewaout_sewakembali: '1900-01-01',
			sewaout_jangkasewakembali: '',
			sewaout_selesaisewakembali: '',
			sewaout_jumlahlantai: '',
			jumlahLantaiText: '-- Choose --',
			sewaout_disewakanke: 0,
			disewakanKeDropdownOpen: false,

			//Data Pajak Reklame m_sewa_outlet
			pjkout_runningid: '',
			pjkout_userid: '',
			pjkout_startdate: '1900-01-01',
			pjkout_enddate: '1900-01-02',
			pjkout_startdate1: '1900-01-01',
			pjkout_enddate1: '1900-01-02',
			pjkout_startdate2: '1900-01-01',
			pjkout_enddate2: '1900-01-02',
			pjkoutyn1: 'N',
			pjkoutyn1checked: false,
			pjkoutyn1disabled: false,
			pjkoutyn2: 'N',
			pjkoutyn2checked: false,
			pjkoutyn2disabled: false,

			//Penyewa dan GPL
			gpl: [],
			penyewa: [],
			addPenyewaInput: '',

			// Invalid
			sewaout_namapemlokInvalid: false,
			sewaout_grouppemlokInvalid: false,
			sewaout_phonepemlokInvalid: false,
			sewaout_namacp1Invalid: false,
			sewaout_namacp2Invalid: false,
			sewaout_bastInvalid: false,
			bast1Invalid: false,
			bast2Invalid: false,
			bast3Invalid: false,
			bast4Invalid: false,
			bastSaveButtonDisabled: true,

			sewaout_jangkasewakembaliInvalid: false,
			sewaout_jumlahlantaiInvalid: false,
			sewaout_disewakankeInvalid: false,

			pjkout_startdateInvalid: false,
			pjkout_enddateInvalid: false,
			pjkout_startdate1Invalid: false,
			pjkout_enddate1Invalid: false,
			pjkout_startdate2Invalid: false,
			pjkout_enddate2Invalid: false,

			// Valid
			sewaout_namapemlokValid: false,
			sewaout_grouppemlokValid: false,
			sewaout_phonepemlokValid: false,
			sewaout_namacp1Valid: false,
			sewaout_namacp2Valid: false,
			sewaout_bastValid: false,
			bast1Valid: false,
			bast2Valid: false,
			bast3Valid: false,
			bast4Valid: false,
			bastSaveButtonDisabled: true,

			sewaout_jangkasewakembaliValid: false,
			sewaout_jumlahlantaiValid: false,
			sewaout_disewakankeValid: false,

			pjkout_startdateValid: false,
			pjkout_enddateValid: false,
			pjkout_startdate1Valid: false,
			pjkout_enddate1Valid: false,
			pjkout_startdate2Valid: false,
			pjkout_enddate2Valid: false,

			//Add & Edit Button
			displayAddButton: 'd-none',
			displaySimpanButton: 'd-none',
			displayEditButton: 'd-none',
			displayOkButton: 'd-none',
			displaySewaKembaliSaveButton: 'd-none',
			displayPajakReklameSimpanButton: 'd-none',
			displayPajakReklameOkButton: 'd-none',

			// Modal
			modal: false,
			modal_outletSearch: false,
			modal_sewaPeriode: false,
			modal_sewaKembali: false,
			modal_pajakReklame: false,
			modal_bast: false,
			modal_addPenyewa: false,
			modal_konfirmasiSimpan: false,
			modal_konfirmasiOk: false
		};

		this.outletSearchInputRef = React.createRef();
	}

	//Dipanggil ketika load page
	componentDidMount() {
		this.getPenyewaDanGPL();
	}

	//----------------------------------------------------------------------

	//Method untuk membuka suatu Modal di page tsb
	toggle = modalType => () => {

		if (!modalType) {

			return this.setState({
				modal: !this.state.modal,
			});
		}

		//Pembuatan setState disemua function, dimana hanya memanggil nama nya saja ex modal_delete , maka di render hanya panggil delete saja 
		this.setState({
			[`modal_${modalType}`]: !this.state[`modal_${modalType}`]
		});
	};


	//fungsi notification
	showNotification = (currMessage) => {
		setTimeout(() => {
			if (!this.notificationSystem) {
				return;
			}
			this.notificationSystem.addNotification({
				title: <MdLoyalty />,
				message:
					currMessage,
				level: 'info',
			});
		}, 100);
	}

	toggleBastModal = () => {
		const modalBastState = this.state.modal_bast;

		this.setState({
			bastSaveButtonDisabled: true,
			modal_bast: !modalBastState
		})
	}

	// --------------------- INPUT HANDLER ---------------------
	// Method untuk meng-handle perubahan pada input
	handleInputChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[event.target.name]: value.replace(/[^\w\s]/gi, "").toUpperCase()
		}, () => console.log('HandleInputChange: Input:' + name + ' = ' + value));
	}

	handleInputValidateChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		if (value.length === 0) {
			this.setState({
				[event.target.name]: value.replace(/[^\w\s]/gi, "").toUpperCase(),
				[event.target.name + 'Invalid']: true,
				[event.target.name + 'Valid']: false
			}, () => console.log('HandleInputValidateChange: Input:' + name + ' = ' + value));
		} else {
			this.setState({
				[event.target.name]: value.replace(/[^\w\s]/gi, "").toUpperCase(),
				[event.target.name + 'Invalid']: false,
				[event.target.name + 'Valid']: true
			}, () => console.log('HandleInputValidateChange: Input:' + name + ' = ' + value));
		}
	}

	handleInputTelephone = (event) => {
		const regularExpression = /[^0-9]/gi;

		const name = event.target.name;
		const value = event.target.value.replace(regularExpression, "");

		this.setState({
			[event.target.name]: value
		}, () => console.log('HandleInputNumberChange: Input: ' + name + ' = ' + value));
	}

	handleInputValidateTelephone = (event) => {
		const regularExpression = /[^0-9]/gi;

		const name = event.target.name;
		const value = event.target.value.replace(regularExpression, "");

		if (value.length === 0) {
			this.setState({
				[event.target.name]: value,
				[event.target.name + 'Invalid']: true,
				[event.target.name + 'Valid']: false
			}, () => console.log('handleInputValidateTelephone: Input: ' + name + ' = ' + value));
		} else {
			this.setState({
				[event.target.name]: value,
				[event.target.name + 'Invalid']: false,
				[event.target.name + 'Valid']: true
			}, () => console.log('handleInputValidateTelephone: Input: ' + name + ' = ' + value));
		}
	}

	handleInputDateChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[event.target.name]: value
		}, () => console.log('HandleInputChange: InputDate: ' + name + ' = ' + value));
	}

	handleBillboard1StartDateInputChange = (event) => {
		const value = event.target.value;
		const startDate = new Date(value);
		// const endDate = new Date(this.state.pjkout_enddate);
		const endDate = new Date(value);
		endDate.setFullYear(endDate.getFullYear() + 1);
		endDate.setDate(endDate.getDate() - 1);

		console.log('Billboard1: StartDate: ' + startDate);
		console.log('Billboard1: EndDate: ' + endDate);

		this.setState({
			pjkout_startdate: startDate.toISOString().substr(0, 10),
			pjkout_enddate: endDate.toISOString().substr(0, 10),
			pjkout_startdateInvalid: false,
			pjkout_startdateValid: true,
			pjkout_enddateInvalid: false,
			pjkout_enddateValid: true
		})

		// if (startDate >= endDate) {
		// 	this.setState({
		// 		pjkout_startdate: startDate.toISOString().substr(0, 10),
		// 		pjkout_startdateInvalid: true,
		// 		pjkout_startdateValid: false,
		// 		pjkout_enddateInvalid: true,
		// 		pjkout_enddateValid: false
		// 	})
		// } else {
		// 	this.setState({
		// 		pjkout_startdate: startDate.toISOString().substr(0, 10),
		// 		pjkout_startdateInvalid: false,
		// 		pjkout_startdateValid: true,
		// 		pjkout_enddateInvalid: false,
		// 		pjkout_enddateValid: true
		// 	})
		// }
	}

	handleBillboard1EndDateInputChange = (event) => {
		const startDate = new Date(this.state.pjkout_startdate);
		const endDate = new Date(event.target.value);

		console.log('Billboard1: StartDate: ' + startDate);
		console.log('Billboard1: EndDate: ' + endDate);

		if(startDate >= endDate) {
			this.setState({
				pjkout_enddate: endDate.toISOString().substr(0, 10),
				pjkout_startdateInvalid: true,
				pjkout_startdateValid: false,
				pjkout_enddateInvalid: true,
				pjkout_enddateValid: false
			})
		} else {
			this.setState({
				pjkout_enddate: endDate.toISOString().substr(0, 10),
				pjkout_startdateInvalid: false,
				pjkout_startdateValid: true,
				pjkout_enddateInvalid: false,
				pjkout_enddateValid: true
			})
		}
	}

	handleBillboard2StartDateInputChange = (event) => {
		const value = event.target.value;
		const startDate = new Date(value);
		// const endDate = new Date(this.state.pjkout_enddate1);
		const endDate = new Date(value);
		endDate.setFullYear(endDate.getFullYear() + 1);
		endDate.setDate(endDate.getDate() - 1);

		console.log('Billboard1: StartDate: ' + startDate);
		console.log('Billboard1: EndDate: ' + endDate);

		this.setState({
			pjkout_startdate1: startDate.toISOString().substr(0, 10),
			pjkout_enddate1: endDate.toISOString().substr(0, 10),
			pjkout_startdate1Invalid: false,
			pjkout_startdate1Valid: true,
			pjkout_enddate1Invalid: false,
			pjkout_enddate1Valid: true
		})

		// if (startDate >= endDate) {
		// 	this.setState({
		// 		pjkout_startdate1: startDate.toISOString().substr(0, 10),
		// 		pjkout_startdate1Invalid: true,
		// 		pjkout_startdate1Valid: false,
		// 		pjkout_enddate1Invalid: true,
		// 		pjkout_enddate1Valid: false
		// 	})
		// } else {
		// 	this.setState({
		// 		pjkout_startdate1: startDate.toISOString().substr(0, 10),
		// 		pjkout_startdate1Invalid: false,
		// 		pjkout_startdate1Valid: true,
		// 		pjkout_enddate1Invalid: false,
		// 		pjkout_enddate1Valid: true
		// 	})
		// }
	}

	handleBillboard2EndDateInputChange = (event) => {
		const startDate = new Date(this.state.pjkout_startdate1);
		const endDate = new Date(event.target.value);

		console.log('Billboard1: StartDate: ' + startDate);
		console.log('Billboard1: EndDate: ' + endDate);

		if (startDate >= endDate) {
			this.setState({
				pjkout_enddate1: endDate.toISOString().substr(0, 10),
				pjkout_startdate1Invalid: true,
				pjkout_startdate1Valid: false,
				pjkout_enddate1Invalid: true,
				pjkout_enddate1Valid: false
			})
		} else {
			this.setState({
				pjkout_enddate1: endDate.toISOString().substr(0, 10),
				pjkout_startdate1Invalid: false,
				pjkout_startdate1Valid: true,
				pjkout_enddate1Invalid: false,
				pjkout_enddate1Valid: true
			})
		}
	}

	handleSinglepoleStartDateInputChange = (event) => {
		const value = event.target.value;
		const startDate = new Date(value);
		// const endDate = new Date(this.state.pjkout_enddate2);
		const endDate = new Date(value);
		endDate.setFullYear(endDate.getFullYear() + 1);
		endDate.setDate(endDate.getDate() - 1);

		console.log('Billboard1: StartDate: ' + startDate);
		console.log('Billboard1: EndDate: ' + endDate);

		this.setState({
			pjkout_startdate2: startDate.toISOString().substr(0, 10),
			pjkout_enddate2: endDate.toISOString().substr(0, 10),
			pjkout_startdate2Invalid: false,
			pjkout_startdate2Valid: true,
			pjkout_enddate2Invalid: false,
			pjkout_enddate2Valid: true
		})

		// if (startDate >= endDate) {
		// 	this.setState({
		// 		pjkout_startdate2: startDate.toISOString().substr(0, 10),
		// 		pjkout_startdate2Invalid: true,
		// 		pjkout_startdate2Valid: false,
		// 		pjkout_enddate2Invalid: true,
		// 		pjkout_enddate2Valid: false
		// 	})
		// } else {
		// 	this.setState({
		// 		pjkout_startdate2: startDate.toISOString().substr(0, 10),
		// 		pjkout_startdate2Invalid: false,
		// 		pjkout_startdate2Valid: true,
		// 		pjkout_enddate2Invalid: false,
		// 		pjkout_enddate2Valid: true
		// 	})
		// }
	}

	handleSinglepoleEndDateInputChange = (event) => {
		const startDate = new Date(this.state.pjkout_startdate2);
		const endDate = new Date(event.target.value);

		console.log('Billboard1: StartDate: ' + startDate);
		console.log('Billboard1: EndDate: ' + endDate);

		if (startDate >= endDate) {
			this.setState({
				pjkout_enddate2: endDate.toISOString().substr(0, 10),
				pjkout_startdate2Invalid: true,
				pjkout_startdate2Valid: false,
				pjkout_enddate2Invalid: true,
				pjkout_enddate2Valid: false
			})
		} else {
			this.setState({
				pjkout_enddate2: endDate.toISOString().substr(0, 10),
				pjkout_startdate2Invalid: false,
				pjkout_startdate2Valid: true,
				pjkout_enddate2Invalid: false,
				pjkout_enddate2Valid: true
			})
		}
	}

	handleInputPajakCheckbox = (event) => {
		const checked = event.target.checked;
		var yn = 'N';
		if (checked) {
			yn = 'Y'
		}
		console.log('handleInputPajakCheckbox: ' + event.target.name + ' checked: ' + checked);
		console.log('handleInputPajakCheckbox: ' + event.target.name + ' YN: ' + yn);
		this.setState({
			[event.target.name]: yn,
			[event.target.name + 'checked']: checked,
			[event.target.name + 'disabled']: !checked
		})
	}

	handleInputJangkaSewa = (event) => {
		var currentStartDate = this.state.mulai_sewa;
		var value = Math.abs(event.target.value);
		var date = new Date(currentStartDate.substr(0, 4), currentStartDate.substr(5, 2) - 1, currentStartDate.substr(8, 10));

		date.setMonth(date.getMonth() + parseInt(value));
		this.setState({
			jangka_sewa: value,
			selesai_sewa: date.toISOString().substr(0, 10)
		}, console.log('HandleInputChange: InputJangkaSewa: jangka_sewa = ' + value + '\n' + 'HandleInputChange: InputStartDate: ' + currentStartDate + '\n' + 'HandleInputChange: InputFinishDate: ' + this.state.selesai_sewa));
	}

	handleInputNoticeLetter = (event) => {
		var currentStartDate = this.state.mulai_sewa;
		var value = Math.abs(this.state.jangka_sewa - event.target.value);
		var date = new Date(currentStartDate.substr(0, 4), currentStartDate.substr(5, 2) - 1, currentStartDate.substr(8, 10));

		date.setMonth(date.getMonth() + parseInt(value));
		this.setState({
			notice_letter: event.target.value,
			sewaout_warning: date.toISOString().substr(0, 10)
		});
	}

	calculateWarningDate = (selesaiSewa, noticeLetter) => {
		var date = new Date(selesaiSewa.substr(0, 4), selesaiSewa.substr(5, 2) - 1, selesaiSewa.substr(8, 10));

		console.log('WarningDate:  ' + selesaiSewa);

		date.setDate(date.getDate() - 1);

		return date.toISOString().substr(0, 10);
	}

	handleInputSewaKembaliDateChange = (event) => {
		const value = event.target.value;
		const jangkaSewaKembali = this.state.sewaout_jangkasewakembali;

		var endDateValue = new Date(value);
		endDateValue.setMonth(endDateValue.getMonth() + jangkaSewaKembali);
		endDateValue.setDate(endDateValue.getDate() - 1);

		if (jangkaSewaKembali > 0) {
			this.setState({
				sewaout_sewakembali: value,
				sewaout_selesaisewakembali: endDateValue.toISOString().substr(0, 10)
			}, () => console.log('handleInputSewaKembaliDateChange: InputDate: sewaout_sewakembali = ' + value + ' & sewaout_selesaisewakembali = ' + endDateValue));
		} else {
			this.setState({
				sewaout_sewakembali: value
			}, () => console.log('handleInputSewaKembaliDateChange: InputDate: sewaout_sewakembali' + ' = ' + value));
		}
	}

	handleInputJangkaSewaKembali = (event) => {
		const currentStartDate = this.state.sewaout_sewakembali;
		const value = Math.abs(event.target.value);
		var date = new Date(currentStartDate.substr(0, 4), currentStartDate.substr(5, 2) - 1, currentStartDate.substr(8, 10));

		date.setMonth(date.getMonth() + parseInt(value));
		
		if (value.length === 0 || value == '0') {
			this.setState({
				sewaout_jangkasewakembali: value,
				sewaout_selesaisewakembali: date.toISOString().substr(0, 10),
				sewaout_jangkasewakembaliInvalid: true,
				sewaout_jangkasewakembaliValid: false
			}, console.log('HandleInputValidateChange: InputJangkaSewa: jangka_sewa = ' + value + '\n' + 'HandleInputChange: InputStartDate: ' + currentStartDate + '\n' + 'HandleInputChange: InputFinishDate: ' + this.state.sewaout_selesaisewakembali));
		} else {
			this.setState({
				sewaout_jangkasewakembali: value,
				sewaout_selesaisewakembali: date.toISOString().substr(0, 10),
				sewaout_jangkasewakembaliInvalid: false,
				sewaout_jangkasewakembaliValid: true
			}, console.log('HandleInputValidateChange: InputJangkaSewa: jangka_sewa = ' + value + '\n' + 'HandleInputChange: InputStartDate: ' + currentStartDate + '\n' + 'HandleInputChange: InputFinishDate: ' + this.state.sewaout_selesaisewakembali));
		}
	}

	handleJumlahLantaiDropdown = (event) => {
		const value = event.target.value;
		const name = event.target.name;

		this.setState({
			jumlahLantaiText: value,
			sewaout_jumlahlantai: name,
			sewaout_jumlahlantaiInvalid: false,
			sewaout_jumlahlantaiValid: true
		}, console.log('HandleInputChange: Input:' + event.target.name + ' = ' + event.target.value));
	}

	handlePenyewaDropdown = (event) => {
		const value = event.target.value;

		if (value == '0') {
			this.setState({
				sewaout_disewakanke: value,
				sewaout_disewakankeInvalid: true,
				sewaout_disewakankeValid: false
			}, console.log('HandleInputValidateChange: Input: ' + event.target.name + ' = ' + event.target.value));
		} else {
			this.setState({
				sewaout_disewakanke: value,
				sewaout_disewakankeInvalid: false,
				sewaout_disewakankeValid: true
			}, console.log('HandleInputValidateChange: Input: ' + event.target.name + ' = ' + event.target.value));
		}
	}

	handleGroupPemlokDropdown = (event) => {
		const value = event.target.value;
		
		if (value == '0') {
			this.setState({
				sewaout_grouppemlok: event.target.value,
				sewaout_grouppemlokInvalid: true,
				sewaout_grouppemlokValid: false
			}, console.log('GroupPemlok: Value: ' + event.target.value));
		} else {
			this.setState({
				sewaout_grouppemlok: event.target.value,
				sewaout_grouppemlokInvalid: false,
				sewaout_grouppemlokValid: true
			}, console.log('GroupPemlok: Value: ' + event.target.value));
		}
	}

	handleInputBastValidateChange = (event) => {
		const value = event.target.value;
		const name = event.target.name;
		const maxLength = event.target.maxLength;

		if (value.length < maxLength) {
			this.setState({
				[name]: value.replace(/[^\w\s]/gi, "").toUpperCase(),
				[name + 'Invalid']: true,
				[name + 'Valid']: false,
			}, () => this.validateBastSaveButton());
		} else {
			this.setState({
				[name]: value.replace(/[^\w\s]/gi, "").toUpperCase(),
				[name + 'Invalid']: false,
				[name + 'Valid']: true,
			}, () => this.validateBastSaveButton());
		}
	}

	validateBastSaveButton = () => {
		if (this.state.bast1Valid
			&& this.state.bast2Valid
			&& this.state.bast3Valid
			&& this.state.bast4Valid) {
			this.setState({
				bastSaveButtonDisabled: false
			})
		} else {
			this.setState({
				bastSaveButtonDisabled: true
			})
		}
	}

	handleBastSave = () => {
		const bast = this.state.bast1 + '/' + this.state.bast2 + '/' + this.state.bast3 + '/' + this.state.bast4;
		console.log('BAST: ' + bast)
		this.setState({
			modal_bast: false,
			sewaout_bast: bast,
			sewaout_bastInvalid: false,
			sewaout_bastValid: true,
			bastSaveButtonDisabled: true,
		});
	}

	addPenyewa = async () => {

		if (this.state.addPenyewaInput.length === 0) {
			this.showNotification('Nama penyewa tidak boleh kosong');
			return;
		}

		console.log('AddPenyewa: Starting...');

		this.setState({
			isLoading: true
		});

		const url = `${hostUrl}/TambahDataPenyewa`;
		var payload = {
			soutlp_name: this.state.addPenyewaInput,
			soutlp_userid: '0'
		}

		console.log('AddPenyewa: Payload: ' + JSON.stringify(payload));
		console.log('AddPenyewa: Inserting data...')

		let data = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			json: true,
			body: JSON.stringify(payload)
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				}
			});

		console.log('AddPenyewa: Response: ' + data);

		if (data) {
			this.showNotification('Data Penyewa ' + this.state.addPenyewaInput + ' berhasil disimpan');
			this.getPenyewaDanGPL();
		} else {
			alert('Data Penyewa ' + this.state.addPenyewaInput + ' sudah pernah ada');
		}

		this.setState({
			addPenyewaInput: '',
			modal_addPenyewa: false,
			isLoading: false
		})
	}
	// END OF INPUT HANDLER ---------------------

	// --------------------- SEARCH ---------------------
	toggleOutletSearchModal = () => {
		const isOpen = this.state.modal_outletSearch;
		this.setState({
			outletSearchInput: '',
			outletSearchInputFeedback: '',
			outletList: [],
			modal_outletSearch: !isOpen
		}, () => { if (!isOpen) this.outletSearchInputRef.current.focus() });
	}

	//Function untuk melakukan search pada saat menekan enter
	handleOutletSearchOnEnterPressed = (event, search) => {
		const code = event.keyCode || event.which;
		if (code === 13) { //13 is the enter keycode
			//Do stuff in here
			event.preventDefault();
			if (search === true) {
				this.getOutletList(this.state.outletSearchInput);
			}
		}
	}

	getOutletList = (input) => {
		if (input.length === 0) {
			console.log('CariOutletList: ERROR: Must be filled');
			this.setState({
				outletSearchInputFeedback: 'Tidak boleh kosong'
			});
			return;
		}

		this.setState({
			isLoading: true
		})

		const url = `${hostUrl}/CariDataOutletTanpaKota/${input}`
		console.log('CariOutletList: Fetching data from ' + url)
		fetch(url)
			.then(response => response.json())
			.then(data => {
				this.setState({
					outletSearchInputFeedback: data.length > 0 ? '' : 'Tidak ada outlet dengan kode atau nama tersebut',
					outletList: data,
					isLoading: false
				})
			})
	}

	handleCariOutletEnter = (event, search) => {
		const code = event.keyCode || event.which;
		if (code === 13) { //13 is the enter keycode
			event.preventDefault();

			if (search === true) {
				this.cariOutlet(this.state.cariOutcodeInput);
			}
		}
	}

	//Mengambil parameter yang telah diinput di cariOutcodeInput lalu dilempar ke Backend
	cariOutlet = (input) => {
		console.log('CariOutlet: ' + input);

		if (input.length === 0) {
			console.log('CariOutlet: ERROR: Must be filled');
			return;
		}

		this.setState({ isLoading: true });

		const url = `${hostUrl}/TampilDataBusDev/${input}`;
		console.log('CariOutlet: Fetching data from ' + url);
		fetch(url)
			.then(response => response.json())
			.then(data => {
				try {
					this.setState({
						sewaout_runningid: data[0].sewaout_runningid,
						sewaout_outcode: data[0].sewaout_outcode,
						out_name: data[0].out_name,
						tanggal_buka: new Date(data[0].tanggal_buka).toISOString().substr(0, 10),
						mulai_sewa: new Date(data[0].mulai_sewa).toISOString().substr(0, 10),
						selesai_sewa: new Date(data[0].selesai_sewa).toISOString().substr(0, 10),
						jangka_sewa: data[0].jangka_sewa,
						sewaout_namapemlok: data[0].sewaout_namapemlok,
						notice_letter: data[0].notice_letter,
						sewaout_warning: this.calculateWarningDate(new Date(data[0].selesai_sewa).toISOString().substr(0, 10), data[0].notice_letter),
						sewaout_serahterimaowner: new Date(data[0].sewaout_serahterimaowner).toISOString().substr(0, 10),

						// sewaout_sewakembali: new Date(data[0].sewaout_sewakembali).toISOString().substr(0, 10),
						// sewaout_jangkasewakembali: data[0].sewaout_jangkasewakembali,
						// sewaout_selesaisewakembali: new Date(data[0].sewaout_selesaisewakembali).toISOString().substr(0, 10),
						// sewaout_jumlahlantai: data[0].sewaout_jumlahlantai,
						// jumlahLantaiText: this.setJumlahLantai(data[0].sewaout_jumlahlantai),
						// sewaout_disewakanke: data[0].sewaout_disewakanke,

						sewaout_namapemlok: data[0].sewaout_namapemlok,
						sewaout_grouppemlok: data[0].sewaout_grouppemlok,
						sewaout_phonepemlok: data[0].sewaout_phonepemlok,
						sewaout_namacp1: data[0].sewaout_namacp1,
						sewaout_jabatancp1: data[0].sewaout_jabatancp1,
						sewaout_phonecp1: data[0].sewaout_phonecp1,
						sewaout_tanggallahir1: new Date(data[0].sewaout_tanggallahir1).toISOString().substr(0, 10),
						sewaout_namacp2: data[0].sewaout_namacp2,
						sewaout_jabatancp2: data[0].sewaout_jabatancp2,
						sewaout_phonecp2: data[0].sewaout_phonecp2,
						sewaout_tanggallahir2: new Date(data[0].sewaout_tanggallahir2).toISOString().substr(0, 10),
						sewaout_bast: data[0].sewaout_bast,
						bast1: data[0].sewaout_bast.substr(0, 3),
						bast2: data[0].sewaout_bast.substr(4, 3),
						bast3: data[0].sewaout_bast.substr(8, 2),
						bast4: data[0].sewaout_bast.substr(11, 2),

						//Pajak Reklame
						// pjkout_runningid: data[1].pjkout_runningid,
						// pjkout_startdate: new Date(data[1].pjkout_startdate).toISOString().substr(0, 10),
						// pjkout_enddate: new Date(data[1].pjkout_enddate).toISOString().substr(0, 10),
						// pjkout_startdate1: new Date(data[1].pjkout_startdate1).toISOString().substr(0, 10),
						// pjkout_enddate1: new Date(data[1].pjkout_enddate1).toISOString().substr(0, 10),
						// pjkout_startdate2: new Date(data[1].pjkout_startdate2).toISOString().substr(0, 10),
						// pjkout_enddate2: new Date(data[1].pjkout_enddate2).toISOString().substr(0, 10),
						// pjkoutyn1: data[1].pjkoutyn1,
						// pjkoutyn1checked: this.setPajakCheckbox(data[1].pjkoutyn1),
						// pjkoutyn2: data[1].pjkoutyn2,
						// pjkoutyn2checked: this.setPajakCheckbox(data[1].pjkoutyn2),

						buttonDetailDisabled: false,
						sewaKembaliDisabled: false,
						displayAddButton: 'd-none',
						displayEditButton: '',
						displaySimpanButton: 'd-none',
						displayOkButton: 'd-none',
						displaySewaKembaliSaveButton: '',
						buttonAddDisabled: true,
						buttonSearchDisabled: false,

						// Invalid
						sewaout_namapemlokInvalid: false,
						sewaout_grouppemlokInvalid: false,
						sewaout_phonepemlokInvalid: false,
						sewaout_namacp1Invalid: false,
						sewaout_namacp2Invalid: false,
						sewaout_bastInvalid: false,
						bast1Invalid: false,
						bast2Invalid: false,
						bast3Invalid: false,
						bast4Invalid: false,
						bastSaveButtonDisabled: true,

						sewaout_jangkasewakembaliInvalid: false,
						sewaout_jumlahlantaiInvalid: false,
						sewaout_disewakankeInvalid: false,

						// pjkout_startdateInvalid: false,
						// pjkout_enddateInvalid: false,
						// pjkout_startdate1Invalid: false,
						// pjkout_enddate1Invalid: false,
						// pjkout_startdate2Invalid: false,
						// pjkout_enddate2Invalid: false,

						// Valid
						sewaout_namapemlokValid: true,
						sewaout_grouppemlokValid: true,
						sewaout_phonepemlokValid: true,
						sewaout_namacp1Valid: true,
						sewaout_namacp2Valid: true,
						sewaout_bastValid: true,
						bast1Valid: true,
						bast2Valid: true,
						bast3Valid: true,
						bast4Valid: true,
						bastSaveButtonDisabled: true,

						sewaout_jangkasewakembaliValid: true,
						sewaout_jumlahlantaiValid: true,
						sewaout_disewakankeValid: true,

						// pjkout_startdateValid: true,
						// pjkout_enddateValid: true,
						// pjkout_startdate1Valid: true,
						// pjkout_enddate1Valid: true,
						// pjkout_startdate2Valid: true,
						// pjkout_enddate2Valid: true,

						modal_outletSearch: false,
						isLoading: false
					}, () => console.log('CariOutlet: Data successfuly set'));
				} catch (err) {
					console.log('CariOutlet: There is no outlet/busdev data');
					console.log('CariOutlet: Error: ' + err.message);
					this.handleNoBusdev(data);
				}

				this.getSewaKembali(input);
				this.getPajakReklame(input);
			})
	}

	handleNoBusdev = (data) => {
		if (data[0].outlet_exist) {
			console.log('CariOutlet: Busdev does not exist');

			this.setState({
				sewaout_outcode: data[0].out_code,
				out_name: data[0].out_name,
				tanggal_buka: new Date(data[0].tanggal_buka).toISOString().substr(0, 10),

				mulai_sewa: '',
				selesai_sewa: '',
				jangka_sewa: '',
				sewaout_namapemlok: '',
				notice_letter: '',
				sewaout_warning: '',
				sewaout_serahterimaowner: '',

				sewaout_sewakembali: '1900-01-01',
				sewaout_jangkasewakembali: '',
				sewaout_selesaisewakembali: '',
				sewaout_jumlahlantai: '',
				jumlahLantaiText: '-- Choose --',
				sewaout_disewakanke: 0,

				sewaout_namapemlok: '',
				sewaout_grouppemlok: 0,
				sewaout_phonepemlok: '',
				sewaout_namacp1: '',
				sewaout_jabatancp1: '',
				sewaout_phonecp1: '',
				sewaout_tanggallahir1: '',
				sewaout_namacp2: '',
				sewaout_jabatancp2: '',
				sewaout_phonecp2: '',
				sewaout_tanggallahir2: '',
				sewaout_bast: '',
				bast1: '',
				bast2: '',
				bast3: '',
				bast4: '',

				//Pajak Reklame
				// pjkout_runningid: '',
				// pjkout_startdate: '1900-01-01',
				// pjkout_enddate: '1900-01-02',
				// pjkout_startdate1: '1900-01-01',
				// pjkout_enddate1: '1900-01-02',
				// pjkout_startdate2: '1900-01-01',
				// pjkout_enddate2: '1900-01-02',
				// pjkoutyn1: '',
				// pjkoutyn1checked: false,
				// pjkoutyn1disabled: true,
				// pjkoutyn2: '',
				// pjkoutyn2checked: false,
				// pjkoutyn2disabled: true,

				buttonDetailDisabled: false,
				sewaKembaliDisabled: true,
				displayAddButton: '',
				displayEditButton: 'd-none',
				displaySimpanButton: 'd-none',
				displayOkButton: 'd-none',
				displaySewaKembaliSaveButton: 'd-none',
				buttonAddDisabled: true,
				buttonSearchDisabled: false,

				// Invalid
				sewaout_namapemlokInvalid: false,
				sewaout_grouppemlokInvalid: false,
				sewaout_phonepemlokInvalid: false,
				sewaout_namacp1Invalid: false,
				sewaout_namacp2Invalid: false,
				sewaout_bastInvalid: false,
				bast1Invalid: false,
				bast2Invalid: false,
				bast3Invalid: false,
				bast4Invalid: false,
				bastSaveButtonDisabled: true,

				sewaout_jangkasewakembaliInvalid: false,
				sewaout_jumlahlantaiInvalid: false,
				sewaout_disewakankeInvalid: false,

				// pjkout_startdateInvalid: false,
				// pjkout_enddateInvalid: false,
				// pjkout_startdate1Invalid: false,
				// pjkout_enddate1Invalid: false,
				// pjkout_startdate2Invalid: false,
				// pjkout_enddate2Invalid: false,
				
				// Valid
				sewaout_namapemlokValid: false,
				sewaout_grouppemlokValid: false,
				sewaout_phonepemlokValid: false,
				sewaout_namacp1Valid: false,
				sewaout_namacp2Valid: false,
				sewaout_bastValid: false,
				bast1Valid: false,
				bast2Valid: false,
				bast3Valid: false,
				bast4Valid: false,
				bastSaveButtonDisabled: true,

				sewaout_jangkasewakembaliValid: false,
				sewaout_jumlahlantaiValid: false,
				sewaout_disewakankeValid: false,

				// pjkout_startdateValid: false,
				// pjkout_enddateValid: false,
				// pjkout_startdate1Valid: false,
				// pjkout_enddate1Valid: false,
				// pjkout_startdate2Valid: false,
				// pjkout_enddate2Valid: false,

				modal_outletSearch: false,
				isLoading: false
			})
		} else {
			console.log('CariOutlet: Outlet data: ' + data[0].outlet_exist);
			console.log('CariOutlet: Outlet does not exist');

			this.setState({
				isLoading: false
			})
		}
	}

	getSewaKembali = async (input) => {
		const url = `${hostUrl}/TampilDataBusDevSewaKembali/${input}`
		console.log('GetSewaKembali: Fetching data from ' + url);

		fetch(url)
			.then(response => response.json())
			.then(data => {
				try {
					this.setState({
						sewaout_sewakembali: new Date(data.sewaout_sewakembali).toISOString().substr(0, 10),
						sewaout_jangkasewakembali: data.sewaout_jangkasewakembali,
						sewaout_selesaisewakembali: new Date(data.sewaout_selesaisewakembali).toISOString().substr(0, 10),
						sewaout_jumlahlantai: data.sewaout_jumlahlantai,
						jumlahLantaiText: this.setJumlahLantai(data.sewaout_jumlahlantai),
						sewaout_disewakanke: data.sewaout_disewakanke
					}, () => console.log('GetSewaKembali: Data successfuly set'))
				} catch (error) {
					console.log('GetSewaKembali: Error: ' + error.message);
					this.setState({
						sewaout_sewakembali: '1900-01-01',
						sewaout_jangkasewakembali: '',
						sewaout_selesaisewakembali: '',
						sewaout_jumlahlantai: '',
						jumlahLantaiText: '-- Choose --',
						sewaout_disewakanke: 0,
					})
				}
			})
	}

	getPajakReklame = async (input) => {
		const url = `${hostUrl}/TampilDataPajakReklame/${input}`;
		console.log('GetPajakReklame: Fetching data from ' + url);

		fetch(url)
			.then(response => response.json())
			.then(data => {
				try {
					// If exist
					this.setState({
						pjkout_runningid: data[0].pjkout_runningid,
						pjkout_startdate: new Date(data[0].pjkout_startdate).toISOString().substr(0, 10),
						pjkout_enddate: new Date(data[0].pjkout_enddate).toISOString().substr(0, 10),
						pjkout_startdate1: data[0].pjkout_startdate1 !== "NULL" ? new Date(data[0].pjkout_startdate1).toISOString().substr(0, 10) : '1900-01-01',
						pjkout_enddate1: data[0].pjkout_startdate1 !== "NULL" ? new Date(data[0].pjkout_enddate1).toISOString().substr(0, 10) : '1900-01-01',
						pjkout_startdate2: data[0].pjkout_startdate1 !== "NULL" ? new Date(data[0].pjkout_startdate2).toISOString().substr(0, 10) : '1900-01-01',
						pjkout_enddate2: data[0].pjkout_startdate1 !== "NULL" ? new Date(data[0].pjkout_enddate2).toISOString().substr(0, 10) : '1900-01-01',
						pjkoutyn1: data[0].pjkoutyn1,
						pjkoutyn1checked: this.setPajakCheckbox(data[0].pjkoutyn1),
						pjkoutyn1disabled: !this.setPajakCheckbox(data[0].pjkoutyn1),
						pjkoutyn2: data[0].pjkoutyn2,
						pjkoutyn2checked: this.setPajakCheckbox(data[0].pjkoutyn2),
						pjkoutyn2disabled: !this.setPajakCheckbox(data[0].pjkoutyn2),

						// Invalid
						pjkout_startdateInvalid: false,
						pjkout_enddateInvalid: false,
						pjkout_startdate1Invalid: false,
						pjkout_enddate1Invalid: false,
						pjkout_startdate2Invalid: false,
						pjkout_enddate2Invalid: false,

						// Valid
						pjkout_startdateValid: true,
						pjkout_enddateValid: true,
						pjkout_startdate1Valid: true,
						pjkout_enddate1Valid: true,
						pjkout_startdate2Valid: true,
						pjkout_enddate2Valid: true,

						displayPajakReklameSimpanButton: 'd-none',
						displayPajakReklameOkButton: ''
					}, () => console.log('GetPajakReklame: Data successfuly set'))
				} catch (error) {
					// Not exist
					console.log('GetPajakReklame: Error: ' + error.message);
					this.setState({
						pjkout_runningid: '',
						pjkout_startdate: '1900-01-01',
						pjkout_enddate: '1900-01-01',
						pjkout_startdate1: '1900-01-01',
						pjkout_enddate1: '1900-01-01',
						pjkout_startdate2: '1900-01-01',
						pjkout_enddate2: '1900-01-01',
						pjkoutyn1: 'N',
						pjkoutyn1checked: false,
						pjkoutyn1disabled: true,
						pjkoutyn2: 'N',
						pjkoutyn2checked: false,
						pjkoutyn2disabled: true,

						// Invalid
						pjkout_startdateInvalid: false,
						pjkout_enddateInvalid: false,
						pjkout_startdate1Invalid: false,
						pjkout_enddate1Invalid: false,
						pjkout_startdate2Invalid: false,
						pjkout_enddate2Invalid: false,

						// Valid
						pjkout_startdateValid: false,
						pjkout_enddateValid: false,
						pjkout_startdate1Valid: false,
						pjkout_enddate1Valid: false,
						pjkout_startdate2Valid: false,
						pjkout_enddate2Valid: false,

						displayPajakReklameSimpanButton: '',
						displayPajakReklameOkButton: 'd-none'
					})
				}
			})
	}

	setJumlahLantai = (sewaout_jumlahlantai) => {
		if (sewaout_jumlahlantai == 0) {
			return '1 lantai'
		} else {
			return '>1 lantai'
		}
	}

	getPenyewaDanGPL = () => {
		const url = `${hostUrl}/TampilPenyewadanGPL`;
		fetch(url)
			.then(response => response.json())
			.then(data => {
				this.setState({
					gpl: data.GPL,
					penyewa: data.Penyewa
				}, console.log('PENYEWA: ' + data.Penyewa))
			})
	}

	setPajakCheckbox = (yn) => {
		if (yn == 'Y') {
			return true;
		}
		return false;
	}

	// END OF SEARCH

	// --------------------- ADD ---------------------
	handleAddButtonClick = () => {
		this.setState({
			isLoading: true,
			
			sewaout_tanggallahir1:'1900-01-01',
			sewaout_tanggallahir2: '1900-01-01',

			pjkout_startdate: '1900-01-01',
			pjkout_startdate1: '1900-01-01',
			pjkout_startdate2: '1900-01-01',

			// Invalid
			sewaout_namapemlokInvalid: true,
			sewaout_grouppemlokInvalid: true,
			sewaout_phonepemlokInvalid: true,
			sewaout_namacp1Invalid: true,
			sewaout_namacp2Invalid: true,
			sewaout_bastInvalid: true,
			bast1Invalid: true,
			bast2Invalid: true,
			bast3Invalid: true,
			bast4Invalid: true,
			bastSaveButtonDisabled: true,

			sewaout_jangkasewakembaliInvalid: true,
			sewaout_jumlahlantaiInvalid: true,
			sewaout_disewakankeInvalid: true,

			pjkout_startdateInvalid: false,
			pjkout_enddateInvalid: false,
			pjkout_startdate1Invalid: false,
			pjkout_enddate1Invalid: false,
			pjkout_startdate2Invalid: false,
			pjkout_enddate2Invalid: false,

			displayAddButton: 'd-none',
			displaySimpanButton: '',
			displaySewaKembaliSaveButton: 'd-none',

			buttonDetailDisabled: false,
			sewaKembaliDisabled: true,
			buttonAddDisabled: false,

			isLoading: false
		});
	}

	handleSimpanButtonClick = async () => {
		if (!this.validateSimpan()) {
			console.log('Validate: False');
			this.showNotification('Gagal menyimpan data, pastikan data yang dimasukkan sudah benar');
			return;
		}

		// this.simpanPajakReklame();

		console.log('Simpan: Starting...');

		this.setState({
			isLoading: true
		});

		const url = `${hostUrl}/TambahMasterBusDev/`;
		var payload = {
			sewaout_outcode: this.state.sewaout_outcode,
			sewaout_userid: '0',

			sewaout_sewakembali: '1900-01-01',
			sewaout_jangkasewakembali: '0',
			sewaout_selesaisewakembali: '1900-01-01',
			sewaout_jumlahlantai: '0',
			sewaout_disewakanke: '0',

			sewaout_namapemlok: this.state.sewaout_namapemlok,
			sewaout_grouppemlok: this.state.sewaout_grouppemlok,
			sewaout_phonepemlok: this.state.sewaout_phonepemlok,
			sewaout_namacp1: this.state.sewaout_namacp1,
			sewaout_jabatancp1: this.state.sewaout_jabatancp1,
			sewaout_phonecp1: this.state.sewaout_phonecp1,
			sewaout_tanggallahir1: this.state.sewaout_tanggallahir1,
			sewaout_namacp2: this.state.sewaout_namacp2,
			sewaout_jabatancp2: this.state.sewaout_jabatancp2,
			sewaout_phonecp2: this.state.sewaout_phonecp2,
			sewaout_tanggallahir2: this.state.sewaout_tanggallahir2,
			sewaout_bast: this.state.sewaout_bast
		};

		console.log('Simpan: Payload: ' + JSON.stringify(payload));
		console.log('Simpan: Inserting data...');
		let data = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			json: true,
			body: JSON.stringify(payload)
		}).then(response => {
			if (response.ok) {
				return response.json();
			}
		});

		console.log('Simpan: Response: ' + data);

		if (data) {
			this.showNotification('Data Busdev untuk Outlet ' + this.state.out_name + ' berhasil disimpan'); 
			this.setState({
				isLoading: false,
				modal_konfirmasiSimpan: false
			});
			this.cariOutlet(this.state.sewaout_outcode);
		} else {
			this.showNotification('Data Busdev untuk Outlet ' + this.state.out_name + ' sudah pernah ada');
			this.setState({
				isLoading: false,
				modal_konfirmasiSimpan: false
			});
		}
	}

	validateSimpan = () => {
		var inputValid = [
			this.state.sewaout_namapemlokValid,
			// this.state.sewaout_grouppemlokValid,
			this.state.sewaout_phonepemlokValid,
			// this.state.sewaout_jangkasewakembaliValid,
			// this.state.sewaout_jumlahlantaiValid,
			// this.state.sewaout_disewakankeValid
		];

		console.log('ValidList: ' + inputValid);

		if (inputValid.includes(false)) {
			return false;
		} else {
			return true;
		}
	}

	//END OF ADD

	// --------------------- UPDATE ---------------------
	handleEditButtonClick = () => {
		this.setState({
			isLoading: true,
			displayEditButton: 'd-none',
			displayOkButton: '',
			displaySewaKembaliSaveButton: '',

			buttonDetailDisabled: false,
			sewaKembaliDisabled: false,
			buttonAddDisabled: false,
			buttonSearchDisabled: true,

			isLoading: false
		});
	}

	handleOkButtonClick = async () => {

		if (!this.validateSimpan()) {
			console.log('Validate: False');
			this.showNotification('Gagal menyimpan data, pastikan data yang dimasukkan sudah benar');
			return;
		}

		// this.updatePajakReklame();

		console.log('OK: Starting...');

		this.setState({
			isLoading: true
		});

		const url = `${hostUrl}/UbahMasterBusDev/${this.state.sewaout_runningid}`;
		var payload = {
			sewaout_outcode: this.state.sewaout_outcode,
			sewaout_userid: '0',

			sewaout_sewakembali: this.state.sewaout_sewakembali,
			sewaout_jangkasewakembali: this.state.sewaout_jangkasewakembali,
			sewaout_selesaisewakembali: this.state.sewaout_selesaisewakembali,
			sewaout_jumlahlantai: this.state.sewaout_jumlahlantai,
			sewaout_disewakanke: this.state.sewaout_disewakanke,

			sewaout_namapemlok: this.state.sewaout_namapemlok,
			sewaout_grouppemlok: this.state.sewaout_grouppemlok,
			sewaout_phonepemlok: this.state.sewaout_phonepemlok,
			sewaout_namacp1: this.state.sewaout_namacp1,
			sewaout_jabatancp1: this.state.sewaout_jabatancp1,
			sewaout_phonecp1: this.state.sewaout_phonecp1,
			sewaout_tanggallahir1: this.state.sewaout_tanggallahir1,
			sewaout_namacp2: this.state.sewaout_namacp2,
			sewaout_jabatancp2: this.state.sewaout_jabatancp2,
			sewaout_phonecp2: this.state.sewaout_phonecp2,
			sewaout_tanggallahir2: this.state.sewaout_tanggallahir2,
			sewaout_bast: this.state.sewaout_bast
		};

		console.log('OK: Payload: ' + JSON.stringify(payload));
		console.log('OK: Inserting data');

		let data = await fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			json: true,
			body: JSON.stringify(payload)
		}).then(response => {
			if (response.ok) {
				return response.json();
			}
		});

		console.log('OK: Response: ' + data);

		if (data) {
			this.showNotification('Data Busdev untuk Outlet ' + this.state.out_name + ' berhasil disimpan');
			this.setState({
				isLoading: false,
				modal_konfirmasiOk: false
			})
			this.cariOutlet(this.state.sewaout_outcode);
		} else {
			this.showNotification('Data Busdev yang diubah untuk Outlet ' + this.state.out_name + ' sama');
			this.setState({
				isLoading: false,
				modal_konfirmasiOk: false
			})
		}
	}
	// END OF UPDATE ---------------------

	// --------------------- SEWA KEMBALI ---------------------
	handleSaveSewaKembaliButtonClick = async () => {
		if (!this.validateSaveSewaKembali()) {
			console.log('ValidateSewaKembali: False');
			this.showNotification('Gagal menyimpan data, pastikan data yang dimasukkan sudah benar');
			return;
		}

		console.log('SaveSewaKembali: Starting...');

		this.setState({
			isLoading: true
		});

		const url = `${hostUrl}/UbahMasterBusDevSewaKembali/${this.state.sewaout_runningid}`;
		var payload = {
			sewaout_sewakembali: this.state.sewaout_sewakembali,
			sewaout_jangkasewakembali: this.state.sewaout_jangkasewakembali,
			sewaout_selesaisewakembali: this.state.sewaout_selesaisewakembali,
			sewaout_jumlahlantai: this.state.sewaout_jumlahlantai,
			sewaout_disewakanke: this.state.sewaout_disewakanke,
		}

		console.log('SaveSewaKembali: Payload: ' + JSON.stringify(payload));
		console.log('SaveSewaKembali: Saving data');

		let data = await fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			json: true,
			body: JSON.stringify(payload)
		}).then(response => {
			if (response.ok) {
				return response.json();
			}
		});

		console.log('OK: Response: ' + data);

		if (data) {
			this.showNotification('Data Sewa Kembali untuk Outlet ' + this.state.out_name + ' berhasil disimpan');
			this.setState({
				isLoading: false,
				modal_sewaKembali: false
			})
			this.getSewaKembali(this.state.sewaout_outcode);
		} else {
			this.showNotification('Data Sewa Kembali yang diubah untuk Outlet ' + this.state.out_name + ' sama');
			this.setState({
				isLoading: false
			})
		}
	}

	validateSaveSewaKembali = () => {
		var inputValid = [
			// this.state.sewaout_namapemlokValid,
			// this.state.sewaout_grouppemlokValid,
			// this.state.sewaout_phonepemlokValid,
			this.state.sewaout_jangkasewakembaliValid,
			this.state.sewaout_jumlahlantaiValid,
			this.state.sewaout_disewakankeValid
		];

		console.log('ValidSewaKembaliList: ' + inputValid);

		if (inputValid.includes(false)) {
			return false;
		} else {
			return true;
		}
	}
	// END OF SEWA KEMBALI ---------------------

	// --------------------- PAJAK REKLAME ---------------------
	simpanPajakReklame = async () => {
		console.log('SimpanPajakReklame: Starting...');

		if (!this.validateSimpanPajakReklame()) {
			console.log('ValidatePajakReklame: False');
			this.showNotification('Gagal menyimpan data, pastikan data yang dimasukkan sudah benar');
			return;
		}

		this.setState({
			isLoading: true
		});

		const url = `${hostUrl}/TambahPajakReklame/${this.state.sewaout_outcode}`;

		var startDate1 = '1900-01-01';
		var endDate1 = '1900-01-01';
		var startDate2 = '1900-01-01';
		var endDate2 = '1900-01-01';

		if (this.state.pjkoutyn1checked) {
			startDate1 = this.state.pjkout_startdate1;
			endDate1 = this.state.pjkout_enddate1;
		}

		if (this.state.pjkoutyn2checked) {
			startDate2 = this.state.pjkout_startdate2;
			endDate2 = this.state.pjkout_enddate2;
		}

		var payload = {
			pjkout_userid: '0',
			pjkout_startdate: this.state.pjkout_startdate,
			pjkout_enddate: this.state.pjkout_enddate,
			pjkout_startdate1: startDate1,
			pjkout_enddate1: endDate1,
			pjkout_startdate2: startDate2,
			pjkout_enddate2: endDate2,
			pjkoutyn1: this.state.pjkoutyn1,
			pjkoutyn2: this.state.pjkoutyn2
		};

		console.log('SimpanPajakReklame: Payload: ' + JSON.stringify(payload));
		console.log('SimpanPajakReklame: Inserting data');

		let data = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			json: true,
			body: JSON.stringify(payload)
		}).then(response => {
			if (response.ok) {
				return response.json();
			}
		});
		console.log('SimpanPajakReklame: Response: ' + data);

		if (data) {
			this.showNotification('Data Pajak Reklame untuk Outlet ' + this.state.out_name + ' berhasil disimpan');
			this.setState({
				modal_pajakReklame: false
			})
			this.getPajakReklame(this.state.sewaout_outcode);
		} else {
			alert('Data Pajak Reklame untuk Outlet ' + this.state.out_name + ' sudah pernah ada');
			this.setState({
				isLoading: false
			})
		}

	}

	updatePajakReklame = async () => {

		if (!this.validateSimpanPajakReklame()) {
			console.log('ValidatePajakReklame: False');
			this.showNotification('Gagal menyimpan data, pastikan data yang dimasukkan sudah benar');
			return;
		}

		this.setState({
			isLoading: true
		});

		console.log('UpdatePajakReklame: Starting...');

		var startDate1 = '1900-01-01';
		var endDate1 = '1900-01-01';
		var startDate2 = '1900-01-01';
		var endDate2 = '1900-01-01';

		if (this.state.pjkoutyn1checked) {
			startDate1 = this.state.pjkout_startdate1;
			endDate1 = this.state.pjkout_enddate1;
		}

		if (this.state.pjkoutyn2checked) {
			startDate2 = this.state.pjkout_startdate2;
			endDate2 = this.state.pjkout_enddate2;
		}

		const url = 'https://api.docnet.id/CHCMasterH/MasterOutlet/UbahPajakReklame/' + this.state.pjkout_runningid;
		var payload = {
			pjkout_outcode: this.state.sewaout_outcode,
			pjkout_userid: '0',
			pjkout_startdate: this.state.pjkout_startdate,
			pjkout_enddate: this.state.pjkout_enddate,
			pjkout_startdate1: startDate1,
			pjkout_enddate1: endDate1,
			pjkout_startdate2: startDate2,
			pjkout_enddate2: endDate2,
			pjkoutyn1: this.state.pjkoutyn1,
			pjkoutyn2: this.state.pjkoutyn2
		};

		console.log('UpdatePajakReklame: Inserting data');
		let data = await fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			json: true,
			body: JSON.stringify(payload)
		}).then(response => {
			if (response.ok) {
				this.isLoading = false;
				return response.json();
			}
			console.log('UpdatePajakReklame: Payload: ' + payload);
		});
		console.log('UpdatePajakReklame: Response: ' + data);

		if (data) {
			this.showNotification('Data Pajak Reklame untuk Outlet ' + this.state.out_name + ' berhasil disimpan');
			this.setState({
				modal_pajakReklame: false
			})
			this.cariOutlet(this.state.sewaout_outcode);
		} else {
			alert('Data Pajak Reklame untuk Outlet ' + this.state.out_name + ' sama');
			this.setState({
				isLoading: false
			})
		}
	}

	validateSimpanPajakReklame = () => {
		var inputValid = [
			this.state.pjkout_startdateValid,
			this.state.pjkout_enddateValid
		];

		if (this.state.pjkoutyn1checked) {
			var billboard2 = [this.state.pjkout_startdate1Valid, this.state.pjkout_enddate1Valid]
			inputValid.concat(billboard2);
		}

		if (this.state.pjkoutyn2checked) {
			var singlepole = [this.state.pjkout_startdate2Valid, this.state.pjkout_enddate2Valid]
			inputValid.concat(singlepole);
		}


		console.log('PajakReklameValidList: ' + inputValid);

		if (inputValid.includes(false)) {
			return false;
		} else {
			return true;
		}
	}
	// END OF PAJAK REKLAME ---------------------

	//render biasa nya di-isi untuk desain HTML
	render() {
		const { result } = this.state;
		return (
			<Page
				title="Busdev"
				breadcrumbs={[{ name: 'busdev', active: true }]}
				className="BusdevPage">

				<Card className="mb-3">
					<NotificationSystem
						dismissible={false}
						ref={notificationSystem =>
							(this.notificationSystem = notificationSystem)
						}
						style={NOTIFICATION_SYSTEM_STYLE} />

					<CardHeader>
						<Form className="cr-search-form">
							<Row form className='d-flex justify-content-between align-items-center'>
								<Col md={4}>
									<FormGroup className='d-none'>
										<MdSearch
											size="20"
											className="cr-search-form__icon-search text-secondary" />
										<InputGroup>
											<Input
												className="cr-search-form_input d-inline flex-shrink-1"
												name='cariOutcodeInput'
												value={this.state.cariOutcodeInput}
												maxLength='3'
												placeholder="Cari Outlet ID.."
												disabled={this.state.isLoading}
												onChange={event => this.handleInputChange(event)}
												onKeyPress={event => this.handleCariOutletEnter(event, true)} />

											<InputGroupAddon addonType='append'>
												<Button
													disabled={this.state.isLoading || this.state.buttonSearchDisabled}
													onSubmit={event => event.preventDefault()}
													onClick={() => this.cariOutlet(this.state.cariOutcodeInput)}>
													<MdSearch />
												</Button>
											</InputGroupAddon>

										</InputGroup>
									</FormGroup>
								</Col>

								<Col md={3} className='d-flex ml-auto justify-content-end'>
									<Button
										disabled={this.state.isLoading}
										className={this.state.displayAddButton}
										onClick={() => this.handleAddButtonClick()}>
										Add
									</Button>

									<Button
										color='success'
										disabled={this.state.isLoading}
										className={this.state.displaySimpanButton}
										onClick={this.toggle('konfirmasiSimpan')}>
										Simpan
                					</Button>

									<Button
										disabled={this.state.isLoading}
										className={'ml-4 ' + this.state.displayEditButton}
										onClick={() => this.handleEditButtonClick()}>
										Edit
                					</Button>

									<Button
										color='success'
										disabled={this.state.isLoading}
										className={this.state.displayOkButton}
										color="success"
										onClick={this.toggle('konfirmasiOk')}>
										OK
                					</Button>
								</Col>
							</Row>
						</Form>
					</CardHeader>

					<CardBody>
						<Form>
							<Row form className='d-flex justify-content-between align-items-center'>
								<Col md={7}>
									<FormGroup>
										<Label>Outlet</Label>
										<InputGroup className='d-flex' onClick={() => this.toggleOutletSearchModal()}>
											<Input
												// Outcode
												disabled
												value={this.state.sewaout_outcode}
												maxLength="3" />
											<Input
												// Nama PT ?
												disabled
												className='d-none'
												value='N/A'
												maxLength="2" />
											<Input xs={10} md={3}
												// Outname
												disabled
												className='flex-grow-1 w-50'
												value={this.state.out_name} />
											<InputGroupAddon addonType='append'>
												<Button disabled={this.state.isLoading || this.state.buttonSearchDisabled} onClick={event => event.preventDefault()}><MdSearch /></Button>
											</InputGroupAddon>
										</InputGroup>
									</FormGroup>
								</Col>

								<Col md={3}>
									<FormGroup>
										<Label>Tanggal Buka</Label>
										<Input
											disabled
											type="date"
											value={this.state.tanggal_buka} />
									</FormGroup>
								</Col>

								<Col md={2}>
									<FormGroup>
										<Label>Details</Label>
										<UncontrolledDropdown>
											<DropdownToggle caret className='btn-primary' disabled={this.state.buttonDetailDisabled}>Show</DropdownToggle>
											<DropdownMenu>
												<DropdownItem onClick={this.toggle('sewaPeriode')}>
													Sewa Periode
												</DropdownItem>
												<DropdownItem disabled={this.state.sewaKembaliDisabled} onClick={this.toggle('sewaKembali')}>
													Sewa Kembali
												</DropdownItem>
												<DropdownItem onClick={this.toggle('pajakReklame')}>
													Pajak Reklame
												</DropdownItem>
											</DropdownMenu>
										</UncontrolledDropdown>
									</FormGroup>
								</Col>
							</Row>

							<Row form className="mt-3">
								<Label md={4}>Nama Pemilik Lokasi</Label>
								<Col md={8}>
									<Input
										name='sewaout_namapemlok'
										disabled={this.state.buttonAddDisabled}
										invalid={this.state.sewaout_namapemlokInvalid}
										valid={this.state.sewaout_namapemlokValid}
										value={this.state.sewaout_namapemlok}
										onChange={event => this.handleInputValidateChange(event)} />
								</Col>
							</Row>

							<Row form className="mt-3">
								<Label md={4}>Group - Phone</Label>
								<Col xs={4} md={4}>
									<Input
										disabled={this.state.buttonAddDisabled}
										type='select'
										onChange={event => this.handleGroupPemlokDropdown(event)}
										value={this.state.sewaout_grouppemlok}>
											<option
												name='0'
												value='0'>
												-- Pilih Group --
											</option>
										{this.state.gpl.map((gpl) =>
											<option
												name={gpl.gpl_code}
												value={gpl.gpl_code}>
												{gpl.gpl_name}
											</option>)}
									</Input>
								</Col>
								<Col xs={4} md={4}>
									<Input
										name='sewaout_phonepemlok'
										value={this.state.sewaout_phonepemlok}
										placeholder='No Telephone'
										disabled={this.state.buttonAddDisabled}
										invalid={this.state.sewaout_phonepemlokInvalid}
										valid={this.state.sewaout_phonepemlokValid}
										onChange={event => this.handleInputValidateTelephone(event)} />
								</Col>
							</Row>

							<Card className='mt-3'>
								<CardHeader className='d-flex justify-content-between align-items-center'>
									Contact Person 1
								</CardHeader>
								<CardBody>
									<Row form>
										<Label md={4}>Nama</Label>
										<Col xs={4} md={4}>
											<Input
												name='sewaout_namacp1'
												value={this.state.sewaout_namacp1}
												// invalid={this.state.sewaout_namacp1Invalid}
												// valid={this.state.sewaout_namacp1Valid}
												disabled={this.state.buttonAddDisabled}
												onChange={event => this.handleInputValidateChange(event)} />
										</Col>
									</Row>

									<Row form className="mt-3">
										<Label md={4}>Jabatan - HP</Label>
										<Col xs={4} md={4}>
											<Input
												name='sewaout_jabatancp1'
												value={this.state.sewaout_jabatancp1}
												placeholder='Jabatan'
												disabled={this.state.buttonAddDisabled}
												onChange={event => this.handleInputChange(event)} />
										</Col>
										<Col xs={4} md={4}>
											<Input
												name='sewaout_phonecp1'
												value={this.state.sewaout_phonecp1}
												placeholder='No Telephone'
												disabled={this.state.buttonAddDisabled}
												onChange={event => this.handleInputTelephone(event)} />
										</Col>
									</Row>

									<Row form className="mt-3">
										<Label md={4}>Tanggal Lahir</Label>
										<Col xs={4} md={4}>
											<Input
												name='sewaout_tanggallahir1'
												type="date"
												value={this.state.sewaout_tanggallahir1}
												disabled={this.state.buttonAddDisabled}
												required
												onChange={event => this.handleInputDateChange(event)} />
										</Col>
									</Row>
								</CardBody>
							</Card>

							<Card className='mt-3'>
								<CardHeader className='d-flex justify-content-between align-items-center'>
									Contact Person 2
								</CardHeader>
								<CardBody>
									<Row form className="mt-3">
										<Label md={4}>Nama</Label>
										<Col xs={4} md={4}>
											<Input
												name='sewaout_namacp2'
												value={this.state.sewaout_namacp2}
												// invalid={this.state.sewaout_namacp2Invalid}
												// valid={this.state.sewaout_namacp2Valid}
												disabled={this.state.buttonAddDisabled}
												onChange={event => this.handleInputValidateChange(event)} />
										</Col>
									</Row>
									<Row form className="mt-3">
										<Label md={4}>Jabatan - HP</Label>
										<Col xs={4} md={4}>
											<Input
												name='sewaout_jabatancp2'
												value={this.state.sewaout_jabatancp2}
												placeholder='Jabatan'
												disabled={this.state.buttonAddDisabled}
												onChange={event => this.handleInputChange(event)} />
										</Col>
										<Col xs={4} md={4}>
											<Input
												name='sewaout_phonecp2'
												value={this.state.sewaout_phonecp2}
												placeholder='No Telephone'
												disabled={this.state.buttonAddDisabled}
												onChange={event => this.handleInputTelephone(event)} />
										</Col>
									</Row>

									<Row form className="mt-3">
										<Label md={4}>Tanggal Lahir</Label>
										<Col xs={4} md={4}>
											<Input
												name='sewaout_tanggallahir2'
												type="date"
												value={this.state.sewaout_tanggallahir2}
												disabled={this.state.buttonAddDisabled}
												required
												onChange={event => this.handleInputDateChange(event)} />
										</Col>
									</Row>
								</CardBody>
							</Card>

							<Row form className='mt-3'>
								<Label md={4}>BAST</Label>
								<Col md={4}>
									<InputGroup>
										<Input
											disabled
											// invalid={this.state.sewaout_bastInvalid}
											// valid={this.state.sewaout_bastValid}
											value={this.state.sewaout_bast} />
										<InputGroupAddon addonType='append'>
											<Button disabled={this.state.buttonAddDisabled} onClick={this.toggle('bast')}>EDIT</Button>
										</InputGroupAddon>
									</InputGroup>
								</Col>
							</Row>

							<Modal
								// Modal untuk search Outlet
								isOpen={this.state.modal_outletSearch}
								toggle={() => this.toggleOutletSearchModal()}
								className='modal-dialog-scrollable modal-dialog-centered'
								size='lg'
								backdrop='static'>
								<ModalHeader>Search Outlet</ModalHeader>
								<ModalBody>
									<FormGroup>
										<InputGroup>
											<Input
												innerRef={this.outletSearchInputRef}
												name='outletSearchInput'
												placeholder='Ketik kode atau nama outlet'
												value={this.state.outletSearchInput}
												disabled={this.state.isLoading}
												onKeyPress={event => this.handleOutletSearchOnEnterPressed(event, true)}
												onChange={event => this.handleInputChange(event)} />
											<InputGroupAddon addonType='append'>
												<Button disabled={this.state.isLoading} onClick={() => this.getOutletList(this.state.outletSearchInput)}>
													<MdSearch />
												</Button>
											</InputGroupAddon>
										</InputGroup>
										<Label style={{ color: 'red' }} className='px-2 py-1'>{this.state.outletSearchInputFeedback}</Label>
									</FormGroup>
									<ListGroup className='mt-3'>
										<ListGroupItem className={(this.state.outletList.length > 0 ? '' : 'd-none')}>
											<p class='text-center font-weight-bold'>Pilih salah satu</p>
										</ListGroupItem>
										{this.state.outletList.map((outlet) =>
											<ListGroupItem
												tag='button'
												action
												disabled={this.state.isLoading}
												name={outlet.out_code}
												onClick={event => this.cariOutlet(event.target.name)}>
												{outlet.out_code + ' - ' + outlet.out_name}
											</ListGroupItem>
										)}
									</ListGroup>
								</ModalBody>
								<ModalFooter>
									<Button color='danger' disabled={this.state.isLoading} onClick={() => this.toggleOutletSearchModal()}>Tutup</Button>
								</ModalFooter>
							</Modal>

							<Modal
								// Modal untuk konfirmasi Insert
								isOpen={this.state.modal_konfirmasiSimpan}
								toggle={this.toggle('konfirmasiSimpan')}
								className='modal-dialog-centered'
								backdrop='static'>
								<ModalHeader>Konfirmasi Tambah Data BusDev</ModalHeader>
								<ModalBody>
									Apakah yakin ingin simpan data baru?
                                </ModalBody>
								<ModalFooter className='d-flex justify-content-end'>
									<Button color='success' disabled={this.state.isLoading} onClick={() => this.handleSimpanButtonClick()}>Ya</Button>
									<Button color='danger' disabled={this.state.isLoading} onClick={this.toggle('konfirmasiSimpan')}>Batal</Button>
								</ModalFooter>
							</Modal>

							<Modal
								// Modal untuk konfirmasi Edit
								isOpen={this.state.modal_konfirmasiOk}
								toggle={this.toggle('konfirmasiOk')}
								className='modal-dialog-centered'
								backdrop='static'>
								<ModalHeader>Konfirmasi Edit Data BusDev</ModalHeader>
								<ModalBody>
									Apakah yakin ingin edit data?
                                </ModalBody>
								<ModalFooter className='d-flex justify-content-end'>
									<Button color='success' disabled={this.state.isLoading} onClick={() => this.handleOkButtonClick()}>Ya</Button>
									<Button color='danger' disabled={this.state.isLoading} onClick={this.toggle('konfirmasiOk')}>Batal</Button>
								</ModalFooter>
							</Modal>

							<Modal
								// Modal untuk Sewa Periode
								className='modal-dialog-scrollable modal-dialog-centered'
								size="lg"
								isOpen={this.state.modal_sewaPeriode}
								toggle={this.toggle('sewaPeriode')}>
								<ModalHeader toggle={this.toggle('sewaPeriode')}>
									Sewa Periode
                				</ModalHeader>
								<ModalBody>

									<Row form className="d-flex justify-content-between mt-3">
										<Col md={3}>
											<FormGroup>
												<Label>Mulai Sewa</Label>
												<Input
													disabled
													name='mulai_sewa'
													type='date'
													value={this.state.mulai_sewa}
													onChange={event => this.handleInputDateChange(event)} />
											</FormGroup>
										</Col>

										<Col md={3}>
											<FormGroup>
												<Label>Jangka Sewa</Label>
												<InputGroup>
													<Input
														disabled
														name='jangka_sewa'
														type='number'
														value={this.state.jangka_sewa} />
													<InputGroupAddon addonType="append">Month</InputGroupAddon>
												</InputGroup>
											</FormGroup>
										</Col>

										<Col md={3}>
											<FormGroup>
												<Label>Selesai Sewa</Label>
												<Input
													disabled
													type="date"
													value={this.state.selesai_sewa}
													required
												></Input>
											</FormGroup>
										</Col>
									</Row>

									<Row form className="d-flex justify-content-between mt-3">
										<Col md={3}>
											<FormGroup>
												<Label>Notice Letter</Label>
												<InputGroup>
													<Input
														disabled
														type='number'
														name='notice_letter'
														value={this.state.notice_letter} />
													<InputGroupAddon addonType="append">Month</InputGroupAddon>
												</InputGroup>
											</FormGroup>
										</Col>

										<Col md={3}>
											<FormGroup>
												<Label>Warning Date</Label>
												<Input
													type="date"
													value={this.state.sewaout_warning}
													disabled
													required />
											</FormGroup>
										</Col>
									</Row>
								</ModalBody>

								<ModalFooter>
									<Button color='danger' onClick={this.toggle('sewaPeriode')}>Tutup</Button>
								</ModalFooter>
							</Modal>

							<Modal
								// Modal untuk Sewa Kembali
								className='modal-dialog-scrollable modal-dialog-centered'
								size="xl"
								isOpen={this.state.modal_sewaKembali}
								toggle={this.toggle('sewaKembali')}
								backdrop='static'>
								<ModalHeader toggle={this.toggle('sewaKembali')}>
									Sewa Kembali
                				</ModalHeader>
								<ModalBody>

									<Row form className="d-flex justify-content-between mt-3">
										<Col md={3}>
											<FormGroup>
												<Label>Sewa Kembali</Label>
												<Input
													name='sewaout_sewakembali'
													type="date"
													value={this.state.sewaout_sewakembali}
													required
													onChange={event => this.handleInputSewaKembaliDateChange(event)} />
											</FormGroup>
										</Col>
										<Col md={3}>
											<FormGroup>
												<Label>Jangka Sewa Kembali</Label>
												<Input
													type='number'
													invalid={this.state.sewaout_jangkasewakembaliInvalid}
													valid={this.state.sewaout_jangkasewakembaliValid}
													value={this.state.sewaout_jangkasewakembali}
													onChange={event => this.handleInputJangkaSewaKembali(event)}
													maxLength='3' />
											</FormGroup>
										</Col>
										<Col md={3}>
											<FormGroup>
												<Label>Selesai Sewa Kembali</Label>
												<Input
													disabled
													required
													type="date"
													value={this.state.sewaout_selesaisewakembali} />
											</FormGroup>
										</Col>
									</Row>

									<Row form className="d-flex justify-content-between mt-3">
										<Col md={3}>
											<FormGroup>
												<Label>Jumlah Lantai</Label>
												<UncontrolledDropdown direction='up'>
													<DropdownToggle caret>{this.state.jumlahLantaiText}</DropdownToggle>
													<DropdownMenu>
														<DropdownItem
															name='0'
															value='1 lantai'
															onClick={event => this.handleJumlahLantaiDropdown(event)}>
															1 lantai
														</DropdownItem>
														<DropdownItem
															name='1'
															value='>1 lantai'
															onClick={event => this.handleJumlahLantaiDropdown(event)}>
															>1 lantai
														</DropdownItem>
													</DropdownMenu>
												</UncontrolledDropdown>
											</FormGroup>
										</Col>

										<Col md={5}>
											<FormGroup>
												<Label>Disewakan ke</Label>
												<InputGroup>
													<Input
														type='select'
														invalid={this.state.sewaout_disewakankeInvalid}
														valid={this.state.sewaout_disewakankeValid}
														onChange={event => this.handlePenyewaDropdown(event)}
														value={this.state.sewaout_disewakanke}>
														<option
															name='0'
															value='0'>
															-- Pilih Penyewa --
														</option>
														{this.state.penyewa.map((penyewa) =>
															<option
																name={penyewa.soutlp_code}
																value={penyewa.soutlp_code}>
																{penyewa.soutlp_name}
															</option>
														)}
													</Input>
													<InputGroupAddon addonType='append'>
														<Button onClick={this.toggle('addPenyewa')}><MdAdd /></Button>
													</InputGroupAddon>
												</InputGroup>
											</FormGroup>
										</Col>
									</Row>
								</ModalBody>

								<ModalFooter>
									<Button color='success' className={this.state.displaySewaKembaliSaveButton} disabled={this.state.isLoading} onClick={() => this.handleSaveSewaKembaliButtonClick()}>Save</Button>
									<Button color='danger' disabled={this.state.isLoading} onClick={this.toggle('sewaKembali')}>Tutup</Button>
								</ModalFooter>
							</Modal>

							<Modal
								// Modal untuk Pajak Reklame
								size="lg"
								isOpen={this.state.modal_pajakReklame}
								toggle={this.toggle('pajakReklame')}
								className='modal-dialog-centered'
								backdrop='static'>
								<ModalHeader toggle={this.toggle('pajakReklame')}>Pajak Reklame</ModalHeader>
								<ModalBody>
									<Row form>
										<Col md={2} />
										<Col xs={2} md={2} />
										<Col xs={4} md={4}>
											<Label>Start Date</Label>
										</Col>
										<Col xs={4} md={4}>
											<Label>Expired Date</Label>
										</Col>
									</Row>

									<Row form>
										<Col md={2} />
										<Label md={2}>BILLBOARD 1</Label>
										<Col xs={4} md={4}>
											<Input
												name='pjkout_startdate'
												type="date"
												required
												value={this.state.pjkout_startdate}
												invalid={this.state.pjkout_startdateInvalid}
												valid={this.state.pjkout_startdateValid}
												onChange={event => this.handleBillboard1StartDateInputChange(event)} />
										</Col>
										<Col xs={4} md={4}>
											<Input
												name='pjkout_enddate'
												type="date"
												required
												value={this.state.pjkout_enddate}
												invalid={this.state.pjkout_enddateInvalid}
												valid={this.state.pjkout_enddateValid}
												disabled
												onChange={event => this.handleBillboard1EndDateInputChange(event)} />
										</Col>
									</Row>

									<Row form className="mt-3">
										<Col md={2} className='d-flex justify-content-center'>
											<Input
												name='pjkoutyn1'
												type='checkbox'
												checked={this.state.pjkoutyn1checked}
												onClick={event => this.handleInputPajakCheckbox(event)} />
										</Col>
										<Label md={2}>BILLBOARD 2</Label>
										<Col xs={4} md={4}>
											<Input
												name='pjkout_startdate1'
												type="date"
												value={this.state.pjkout_startdate1}
												disabled={this.state.pjkoutyn1disabled}
												required
												invalid={this.state.pjkout_startdate1Invalid}
												valid={this.state.pjkout_startdate1Valid}
												onChange={event => this.handleBillboard2StartDateInputChange(event)} />
										</Col>
										<Col xs={4} md={4}>
											<Input
												name='pjkout_enddate1'
												type="date"
												value={this.state.pjkout_enddate1}
												disabled
												required
												invalid={this.state.pjkout_enddate1Invalid}
												valid={this.state.pjkout_enddate1Valid}
												onChange={event => this.handleBillboard2EndDateInputChange(event)} />
										</Col>
									</Row>

									<Row form className="mt-3">
										<Col md={2} className='d-flex justify-content-center'>
											<Input
												name='pjkoutyn2'
												type='checkbox'
												checked={this.state.pjkoutyn2checked}
												onChange={event => this.handleInputPajakCheckbox(event)} />
										</Col>
										<Label md={2}>SINGLEPOLE</Label>
										<Col xs={4} md={4}>
											<Input
												name='pjkout_startdate2'
												type="date"
												value={this.state.pjkout_startdate2}
												disabled={this.state.pjkoutyn2disabled}
												required
												invalid={this.state.pjkout_startdate2Invalid}
												valid={this.state.pjkout_startdate2Valid}
												onChange={event => this.handleSinglepoleStartDateInputChange(event)} />
										</Col>
										<Col xs={4} md={4}>
											<Input
												name='pjkout_enddate2'
												type="date"
												value={this.state.pjkout_enddate2}
												disabled
												required
												invalid={this.state.pjkout_enddate2Invalid}
												valid={this.state.pjkout_enddate2Valid}
												onChange={event => this.handleSinglepoleEndDateInputChange(event)}></Input>
										</Col>
									</Row>
								</ModalBody>
								<ModalFooter>
									<Button className={this.state.displayPajakReklameSimpanButton} disabled={this.state.isLoading} color='success' onClick={() => this.simpanPajakReklame()}>Simpan</Button>
									<Button className={this.state.displayPajakReklameOkButton} disabled={this.state.isLoading} color='success' onClick={() => this.updatePajakReklame()}>Ok</Button>
									<Button color='danger' disabled={this.state.isLoading} onClick={this.toggle('pajakReklame')}>Tutup</Button>
								</ModalFooter>

							</Modal>

							<Modal
								//Modal untuk BAST
								className='modal-dialog-centered'
								isOpen={this.state.modal_bast}
								toggle={() => this.toggleBastModal()}
								backdrop='static'>
								<ModalHeader>BAST</ModalHeader>
								<ModalBody>
									<Row>
										<Col xs={4} md={4}>
											<Label>BAST</Label>
											<MdInfo
												id="UncontrolledTooltipExample"
												className="ml-1 mb-2"
												size="15px"
											></MdInfo>
										</Col>
										<UncontrolledTooltip
											placement="right"
											target="UncontrolledTooltipExample">
											10 Digit (XXX/XXX/XX/XX) Terdiri dari Nomor/PT/Bulan/Tahun
                    					</UncontrolledTooltip>
									</Row>

									<Row className='d-flex justify-content-between'>
										<Col xs={2} md={3}>
											<Input
												name='bast1'
												value={this.state.bast1}
												maxLength="3"
												invalid={this.state.bast1Invalid}
												valid={this.state.bast1Valid}
												onChange={event => this.handleInputBastValidateChange(event)} />
										</Col>

										<Col xs={2} md={3}>
											<Input
												name='bast2'
												value={this.state.bast2}
												maxLength="3"
												invalid={this.state.bast2Invalid}
												valid={this.state.bast2Valid}
												onChange={event => this.handleInputBastValidateChange(event)} />
										</Col>

										<Col xs={2} md={3}>
											<Input
												name='bast3'
												value={this.state.bast3}
												maxLength="2"
												invalid={this.state.bast3Invalid}
												valid={this.state.bast3Valid}
												onChange={event => this.handleInputBastValidateChange(event)} />
										</Col>

										<Col xs={2} md={3}>
											<Input
												name='bast4'
												value={this.state.bast4}
												maxLength="2"
												invalid={this.state.bast4Invalid}
												valid={this.state.bast4Valid}
												onChange={event => this.handleInputBastValidateChange(event)} />
										</Col>
									</Row>
								</ModalBody>
								<ModalFooter>
									<Button disabled={this.state.bastSaveButtonDisabled} onClick={() => this.handleBastSave()}>
										Save
									</Button>
									<Button onClick={() => this.toggleBastModal()}>
										Tutup
									</Button>
								</ModalFooter>
							</Modal>

							<Modal
								//Modal untuk Add Penyewa
								className='modal-dialog-centered'
								isOpen={this.state.modal_addPenyewa}
								toggle={this.toggle('addPenyewa')}
								backdrop='static'>
								<ModalHeader toggle={this.toggle('addPenyewa')}>Tambah Penyewa</ModalHeader>
								<ModalBody>
									<Input
										name='addPenyewaInput'
										value={this.state.addPenyewaInput}
										disabled={this.state.isLoading}
										onChange={event => this.handleInputChange(event)} />
								</ModalBody>
								<ModalFooter>
									<Button disabled={this.state.isLoading} onClick={() => this.addPenyewa()}>Save</Button>
									<Button disabled={this.state.isLoading} color='danger' onClick={this.toggle('addPenyewa')}>Tutup</Button>
								</ModalFooter>
							</Modal>

						</Form>
					</CardBody>
				</Card>
			</Page>
		);
	}
}
export default BusdevPage;
