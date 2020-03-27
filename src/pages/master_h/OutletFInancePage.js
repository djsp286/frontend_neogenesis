import Page from 'components/Page';
import React from 'react';
import Typography from 'components/Typography';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
  UncontrolledDropdown,
} from 'reactstrap';
import { MdDelete, MdLoyalty, MdSearch } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

const hostUrl = 'https://api.docnet.id/CHCMasterH/MasterOutlet';
class OutletFinancePage extends React.Component {
  //special method
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      jenisMesins: [],
      jenisKartus: [],
      dataVACCs: [],
      noReks: [],
      setoranTransaksi: [],
      kredit: [],
      dataVirtualAccounts: [],
      dataBanks: [],
      dataAtasNamas: [],
      dataRekening: [],
      dataHosts: [],
      searchOutletList: [],
      isLoading: false,
      inputtedName: '',
      inputtedName2: '',
      currentPage: 0,
      todosPerPage: 5,
      flag: 0,
      totalPage: '',
      hidePagination: 'flex-row',
      tableKartuKreditDisplay: 'd-none',
      tableSetoranTunaiDisplay: 'd-none',
      tambahtableSetoranTunai: 'd-none',
      tambahtableKartuKredit: 'd-none',

      displayEditButton: 'd-none',
      displayAddButton: 'd-none',
      buttonAddDisabled: true,
      displayOkButton: 'd-none',
      displaySimpanButton: 'd-none',
      buttonjenisTransaksi: true,
      buttonAddDisabledSetoranTunai: true,
      buttonAddDisabledJenisTransaksi: true,
      modaladdkartuKredit: 'd-none',
      modaladdSetoran: 'd-none',
      modal_addSetoran: false,
      modal_nested: false,
      hostout_cabangbankid: '',
      disableddropdownNoRekening: true,
      disableddropdownVirtualAccount: true,
      disabledJenisKartuKredit: true,
      disabledBankPencairan: true,
      disabledPilihNoRekening: true,
      disabledNoMerchant: true,
      disabledEfektifMesin: true,
      disabledButtonSave: true,
      disabledPenarikanMesin: true,
      disabledButtonSimpan: true,
      hostout_tglefektifmesinInvalid: true,
      hostout_tglefektifmesinValid: false,
      hostout_penarikanmesinInvalid: true,
      hostout_penarikanmesinValid: false,

    };
    this.searchInnerRef = React.createRef();
  }
  //fungsi notification
  showNotification = currMessage => {
    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }
      this.notificationSystem.addNotification({
        title: <MdLoyalty />,
        message: currMessage,
        level: 'info',
      });
    }, 100);
  };
  // ----------------------------------------------- PAGINATION SHOW ALL DATA --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRIS

  //Memberikan semua list data pada page tersebut dimana diBack end mempunyai data Current limit maupun Current Page

  componentDidMount() {}

  addsetoranTunai() {
    //this.getTableVACC();
    this.getTableMesin();
    this.getTableJenisKartu();
    this.getTablePencairan();
    this.getTableNomorRekening(this.state.outcode);
    console.log(this.state.outcode);
    this.setState({
      hostout_vacc_id: '0',
      modal_addSetoran: true,
      addSetoranTunai: 'd-none',
      hostout_cabangbankid: '',
      hostout_atasnama: '',
      hostout_norekening: '',
    });
  }
  addKartuKredit() {
    var dateNow = new Date();

    //this.getTableVACC();
    this.getTableMesin();
    this.getTableJenisKartu();
    this.getTablePencairan();
    this.getTableNomorRekening(this.state.outcode);

    this.setState({
      hostout_cabangbankid: '',
      hostout_hostcode: '',
      jenis_mesin: '',
      hostout_atasnama: '',
      jenis_kartu: '',
      hostout_norekening: '',
      hostout_nomerchant: '',
      hostout_vacc_id: '',
      hostout_tglefektifmesin: dateNow.toISOString().substr(0, 10),
      hostout_penarikanmesin: '1900-01-01',
      hostout_tglefektifmesinInvalid: false,
      hostout_tglefektifmesinValid: true,
      modal_addkartuKredit: true,
      addSetoranTunai: 'inline',
    });
  }

  handleClose = () => {
    this.setState({
      inputtedName2: '',
      jenis_mesin: '',
      jenis_kartu: '',
      hostout_cabangbankname: '',
      hostout_norekening: '',
      hostout_nomerchant: '',
      hostout_tglefektifmesin: '',
      hostout_penarikanmesin: '',
      hostout_vacc_id: '',
      hostout_cabangbankid: '',
      disableddropdownNoRekening: true,
      disableddropdownVirtualAccount: true,
      disabledJenisKartuKredit: true,
      disabledBankPencairan: true,
      disabledPilihNoRekening: true,
      disabledNoMerchant: true,
      disabledEfektifMesin: true,
      disabledButtonSave: true,
      disabledPenarikanMesin: true,
      hostout_penarikanmesinInvalid: false,
    });
  };

  handleDeleteSetoran(hostout_runningid) {
    this.setState({
      modal_delete: true,
      hostout_runningid: hostout_runningid,
    });
  }
  handleDeleteKredit(hostout_runningid) {
    this.setState({
      modal_delete_kredit: true,
      hostout_runningid: hostout_runningid,
    });
  }
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    modal_delete: false,
    modal_update: false,
    backdrop: true,
    inputtedName2: '',
    modal_outletNotFound: false,
    modal_stocktakeNotFound: false,
  };

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  // --------------------------------------------------------- UPDATE --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

  editSetoran = async hostout_runningid => {
    this.setState({ isLoading: true });
    var url = hostUrl + `/UbahFinance/${hostout_runningid}`;
    console.log(url);
    var payload = {
      hostout_jenistransaksi: this.state.jenisTransaksiValue,
      hostout_cabangbankid: this.state.hostout_cabangbankid,
      hostout_atasnama: 'PT PERINTIS PELAYANAN PARIPURNA',
      hostout_norekening: this.state.hostout_norekening,
      hostout_vacc_id: this.state.hostout_vacc_id,
      hostout_userid: '0',
      hostout_hostcode: '0',
      hostout_kdmsn: '1',
      hostout_kdkrt: '1',
      hostout_nomerchant: '0',
      hostout_biid: this.state.hostout_biid,
      hostout_tglefektifmesin: '2000-01-01',
      hostout_penarikanmesin: '2000-01-01',
    };
    console.log(payload);
    let data = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      json: true,
      body: JSON.stringify(payload),
    })
      //2.Ketika sudah terespond oleh backend , maka kita akan melakukan hal ini
      .then(response => {
        if (response.ok) {
          //state ini diawal dibuat fal2se
          return response.json();
        }
      });
    if (data) {
      this.showNotification(
        'Data Berhasil di Ubah Menjadi ' + this.state.hostout_atasnama,
      );
      this.searchInputValue(this.state.outcode);
      this.setState({
     
        tableKartuKreditDisplay: 'd-none',
        tableSetoranTunaiDisplay: 'inline',
        buttonAddDisabledJenisTransaksi: false,
        displayOkButton: 'd-none',
        displayEditButton: 'inline',
        buttonAddDisabledSetoranTunai: true,
        buttonAddDisabled: true,
        modal_nested: false,
        modal_editkartuKredit: false,
        modal_editSetoran: false,
      });
      this.isLoading = false;
    } else {
      alert('Data yang Diubah sama !');
    }
  };
  boolean = false;

  editKartuKredit = async () => {
    this.setState({ isLoading: true });
    var url = hostUrl + `/UbahFinance/${this.state.hostout_runningid}`;
    console.log('setEditKartuKredit' + url);
    var payload = {
      hostout_runningid: this.state.hostout_runningid,
      hostout_outcode: this.state.hostout_outcode,
      hostout_kdmsn: this.state.jenis_mesin,
      hostout_kdkrt: this.state.jenis_kartu,
      hostout_hostcode: this.state.hostout_hostcode,
      hostout_jenistransaksi: this.state.jenisTransaksiValue,
      hostout_cabangbankid: this.state.hostout_cabangbankid,
      hostout_nomerchant: this.state.hostout_nomerchant,
      hostout_atasnama: 'PT PERINTIS PELAYANAN PARIPURNA',
      hostout_norekening: this.state.hostout_norekening,
      hostout_tglefektifmesin: this.state.hostout_tglefektifmesin,
      hostout_penarikanmesin: this.state.hostout_penarikanmesin,
      hostout_vacc_id: this.state.hostout_vacc_id,
      hostout_userid: '0',
      hostout_cabangbankname:this.state.hostout_cabangbankname

    };
    console.log(payload);
    let data = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      json: true,
      body: JSON.stringify(payload),
    })
      //2.Ketika sudah terespond oleh backend , maka kita akan melakukan hal ini
      .then(response => {
      
        if (response.ok) {
          this.searchInputValue(this.state.outcode);
          this.isLoading = false;
          return response.json();


        }
      });
    if (data) {
      this.showNotification('Data Berhasil di Ubah ');
      this.setState({
        tableKartuKreditDisplay: 'inline',
        tableSetoranTunaiDisplay: 'd-none',
        buttonAddDisabledJenisTransaksi: false,
        displayOkButton: 'd-none',
        displayEditButton: 'inline',
        buttonAddDisabledSetoranTunai: true,
        buttonAddDisabled: true,
        modal_nested: false,
        modal_editkartuKredit: false,
        modal_editSetoran: false,
      });
      this.isLoading = true;
    } else {
      alert('Data yang Diubah sama !');
    }
  };
  updateSetoran(
    hostout_cabangbankname,
    hostout_norekening,
    hostout_biid,
    hostout_vacc_id,
    hostout_runningid,
    bank_id
  ) {

    this.getTablePencairan();
    this.getTableNomorRekening(bank_id);
    this.getTableVirtualAccount(hostout_biid);
   
    
    console.log('bank_idLOHHHH,' + bank_id);
    console.log('hostout_biidLOHHHH,' + hostout_biid);
    console.log('hostout_cabangbanknameLOHHH,' + hostout_cabangbankname);
    console.log('hostout_vacc_idLOHHH,' + hostout_vacc_id);
    this.setState({
      bank_id:bank_id,
      hostout_cabangbankname: hostout_cabangbankname,
      hostout_norekening: hostout_norekening,
      hostout_vacc_id: hostout_vacc_id,
      hostout_runningid: hostout_runningid,
      hostout_biid:hostout_biid,
      modal_editSetoran: true,
      buttonAddDisabledSetoranTunai: false,
      buttonAddDisabled: false,
    });
  }

  updateModalWithItemID(
    jenis_mesin,
    jenis_kartu,
    hostout_hostcode,
    hostout_cabangbankid,
    hostout_atasnama,
    hostout_norekening,
    hostout_nomerchant,
    hostout_vacc_id,
    hostout_tglefektifmesin,
    hostout_penarikanmesin,
    hostout_runningid,
    hostout_cabangbankname,
    hostout_outcode,



    
  ) {

    this.getTableMesin();
    this.getTableJenisKartu();
    this.getTablePencairan();
    this.getTableNomorRekening(this.state.outcode);

    this.setState({
  
      jenis_mesin: jenis_mesin,
      jenis_kartu: jenis_kartu,
      hostout_hostcode: hostout_hostcode,
      hostout_cabangbankid: hostout_cabangbankid,
      hostout_atasnama: hostout_atasnama,
      hostout_norekening: hostout_norekening,
      hostout_nomerchant: hostout_nomerchant,
      hostout_vacc_id: hostout_vacc_id,
      hostout_tglefektifmesin: hostout_tglefektifmesin,
      hostout_penarikanmesin: hostout_penarikanmesin,
      hostout_runningid:hostout_runningid,
      hostout_cabangbankname: hostout_cabangbankname,
      modal_editkartuKredit: true,


    });
  }

  handleSik2StartDateInputChange = event => {
    const startDate = new Date(event.target.value);
    const endDate = new Date(this.state.hostout_penarikanmesin);

    console.log('SIA: StartDate: ' + startDate);
    console.log('SIA: EndDate: ' + endDate);
try{

  if (endDate.toISOString().substr(0, 10) === '1900-01-01') {
    console.log('JALAN endateee');
    this.setState({
      hostout_tglefektifmesin: startDate.toISOString().substr(0, 10),
      hostout_tglefektifmesinInvalid: false,
      hostout_tglefektifmesinValid: true,
      disabledButtonSave: false,
    });
    return;
  }
}catch(error){
   
}

    try {
      if (startDate > endDate) {
        this.setState({
          hostout_tglefektifmesin: startDate.toISOString().substr(0, 10),
          hostout_tglefektifmesinInvalid: true,
          hostout_tglefektifmesinValid: false,
          disabledButtonSave: true,
        });
      } else {
        this.setState({
          hostout_tglefektifmesin: startDate.toISOString().substr(0, 10),
          hostout_tglefektifmesinInvalid: false,
          hostout_tglefektifmesinValid: true,
          disabledButtonSave: false,
        });
      }
    } catch (error) {
      this.setState({
        hostout_tglefektifmesin: startDate,
        hostout_tglefektifmesinInvalid: true,
        hostout_tglefektifmesinValid: false,
        disabledButtonSave: true,
      });
    }
  };

  handleSik2EndDateInputChange = event => {
    const startDate = new Date(this.state.hostout_tglefektifmesin);
    const endDate = new Date(event.target.value);
    console.log('SIA: StartDate: ' + startDate);
    console.log('SIA: EndDate: ' + endDate);

    try {
      if (startDate > endDate) {
        this.setState({
          hostout_penarikanmesin: endDate.toISOString().substr(0, 10),
          hostout_penarikanmesinInvalid: true,
          hostout_penarikanmesinValid: false,
          disabledButtonSave: true,
        });
      } else {
        this.setState({
          hostout_penarikanmesin: endDate.toISOString().substr(0, 10),
          hostout_penarikanmesinInvalid: false,
          hostout_penarikanmesinValid: true,
        });
      }
    } catch (error) {
      this.setState({
        hostout_penarikanmesin: endDate,
        hostout_penarikanmesinInvalid: true,
        hostout_penarikanmesinValid: false,
        disabledButtonSave: true,
      });
    }
  };

  //ketika melakukan update, input an yang masuk harus uppercase dan tidak boleh special character
  updateInputValue = evt => {
    this.getTableSemuaDataBank(evt.target.value);
    this.setState({

      disabledButtonSave: false,
      buttonSimpanEdit: true,
      disabledEfektifMesin: false,
      disabledPenarikanMesin: false,
      [evt.target.id]: evt.target.value,
    });
    console.log('inputValue' + evt.target.id + evt.target.id);
  };
  pencairanInputValue = evt => {
    this.getTableNomorRekening(evt.target.value);
    this.setState({
      hostout_cabangbankid: evt.target.value,
    });
  };

  handleNoVirtualAccount = evt => {
    const value = evt.target.value;
    const name = evt.target.name;
    console.log(name + value);
    this.setState(
      {
        disabledButtonSimpan: false,
        disabledNoMerchant: false,
        disableddropdownVirtualAccount: false,
        hostout_norekening: name,
        hostout_cabangbankid: value.substr(0, value.indexOf('@')),
        hostout_biid: value.substr(value.indexOf('@') + 1),
      },
      () => this.getTableVirtualAccount(this.state.hostout_biid),
    );
    console.log(
      'HandleInputChange: Input:' +
        evt.target.name +
        ' = ' +
        this.state.hostout_biid,
    );
  };

  handleNoRekening = evt => {
    this.getTableNomorRekening(evt.target.value);
    const value = evt.target.value;
    const name = evt.target.name;
    console.log(name + value);
    this.setState(
      {
        buttonSimpanEdit: false,
        hostout_norekening: '',
        disabledPilihNoRekening: false,
        disableddropdownNoRekening: false,
        hostout_cabangbankname: name,
        hostout_cabangbankid: value,
        hostout_biid: value,
      },
      console.log(
        'HandleInputChange: Input:' + this.state.hostout_cabangbankid,
      ),
      console.log(
        'HandleInputChange: Input:' +
          evt.target.name +
          ' = ' +
          evt.target.value,
      ),
    );
  };

  updateInputAtasNama = evt => {
    this.getTableNomorRekening(evt.target.value);
    this.getTableVirtualAccount(evt.target.value);
    console.log('InputAtasNama' + evt.target.value);
    this.setState({
      [evt.target.id]: evt.target.value,
    });
  };

  jenisVACCInputValue = evt => {
    this.setState({
      hostout_vacc_id: evt.target.value,
    });
  };

  validasiSetoran = evt => {
    this.setState({
      disableddropdownNoRekening: false,
    });
  };

  jenisMesinInputValue = evt => {
    this.setState(
      {
        jenis_mesin: evt.target.value,
        disabledJenisKartuKredit: false,
      },
      () => this.getHost(),
    );
  };

  jenisKartuInputValue = evt => {
    this.setState(
      {
        jenis_kartu: evt.target.value,
        disabledBankPencairan: false,
      },
      () => this.getHost(),
    );
  };

  updateJenisTransaksi = evt => {
    console.log('jnsTransaksi: ' + evt.target.value);
    var setoranTunaiDisplay;
    var kartuKreditDisplay;
    var setoranTunai;
    var kartuKredit;
    if (evt.target.value === 'S') {
      setoranTunaiDisplay = 'inline';
      kartuKreditDisplay = 'd-none';
      kartuKredit = false;
      setoranTunai = true;
    } else {
      setoranTunaiDisplay = 'd-none';
      kartuKreditDisplay = 'inline';
      kartuKredit = false;
      setoranTunai = false;
    }
    this.setState({
      modaladdSetoran: setoranTunaiDisplay,
      modaladdkartuKredit: kartuKreditDisplay,
      disabledPilihTransaksi:true,
      jenisTransaksiValue: evt.target.value,
      tableSetoranTunaiDisplay: setoranTunaiDisplay,
      tableKartuKreditDisplay: kartuKreditDisplay,
      tambahtableSetoranTunai: setoranTunaiDisplay,
      tambahtableKartuKredit: kartuKreditDisplay,
      buttonAddDisabled: setoranTunai,
      buttonAddDisabledSetoranTunai: kartuKredit,
    });
  };
  // set awal pada saat membuka update

  // --------------------------------------------------------- SEARCH --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

  //mengambil parameter yang telah diinput di searchInputtedName . lalu dilempar ke Backend
  searchInputValue = outcode => {
    this.setState({ isLoading: true, disableClickSearchOutlet: true });

    var url = hostUrl + `/TampilFinanceTransaksi/${outcode}`;
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        try {
          this.setState(
            {
              setoranTransaksi: data[0].setoranTransaksi,
              outcode: data[0].out_code,
              kredit: data[0].kredit,
              out_name: data[0].out_name,
              tambahtableSetoranTunai: 'inline',
              buttonDetailDisabled: false,
              displayAddButton: 'd-none',
              displayEditButton: 'inline',
              buttonAddDisabledJenisTransaksi: false,
              buttonAddDisabledSetoranTunai: true,
              displaySimpanButton: 'd-none',
              displayOkButton: 'd-none',
              buttonAddDisabled: true,
              buttonjenisTransaksi: false,
              isLoading: false,
              modal_outletSearch: false,
              disableClickSearchOutlet: false,
            },
            () => console.log('OUTCODE' + this.state.outcode),
          );
        } catch (err) {
          console.log('ERR: ' + err.message);
          this.setState({
            jenisTransaksiValue: this.state.jenisTransaksiValue,
            buttonAddDisabledJenisTransaksi: false,
            displayEditButton: 'd-none',
            buttonAddDisabledSetoranTunai: true,
          });
          this.handleNoFinance(data);
        }
      });
  };

  onClickSearchOutlet(){
    const isOpen = this.state.modal_outletSearch;
    this.setState({

      modal_outletSearch: !isOpen
    },()=> {if(!isOpen) this.searchInnerRef.current.focus()})
  }


  getsearchOutletList = () => {
    this.setState({
      isLoading: true,
    });
    var url = hostUrl + `/CariDataOutletTanpaKota/${this.state.outletSearch}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState(
          {
            jenisTransaksiValue:'',
            disabledPilihTransaksi:false,
            searchOutletList: data,
            isLoading: false,
          },
          () => console.log('searchOutletList: Data: ' + JSON.stringify(data)),
        );
      });
  };

  editFinance = () => {
    var setoranTunaiDisplay;
    var kartuKreditDisplay;
    var setoranTunai;
    var kartuKredit;

    if (this.state.jenisTransaksiValue === 'S') {
      setoranTunaiDisplay = 'inline';
      kartuKreditDisplay = 'd-none';
      setoranTunai = true;
      kartuKredit = false;
    } else {
      setoranTunaiDisplay = 'd-none';
      kartuKreditDisplay = 'inline';
      setoranTunai = false;
      kartuKredit = false;
    }

    this.setState({
      buttonAddDisabledJenisTransaksi: true,
      isLoading: false,
      displayEditButton: 'd-none',
      displayOkButton: 'inline',

      tableSetoranTunaiDisplay: setoranTunaiDisplay,
      tableKartuKreditDisplay: kartuKreditDisplay,
      buttonAddDisabled: setoranTunai,
      buttonAddDisabledSetoranTunai: kartuKredit,
    });
  };

  handleSimpanKreditButton = async () => {
    console.log('Simpan: Starting...');
    this.setState({
      isLoading: true,
    });
    const url = hostUrl +'/TambahFinance/' + this.state.outcode;
    console.log(url);
    var payload = {
      hostout_hostcode: this.state.hostout_hostcode,
      hostout_jenistransaksi: this.state.jenisTransaksiValue,
      hostout_cabangbankid: this.state.hostout_cabangbankid,
      hostout_nomerchant: this.state.hostout_nomerchant,
      hostout_atasnama: 'PT PERINTIS PELAYANAN PARIPURNA',
      hostout_norekening: this.state.hostout_norekening,
      hostout_biid: this.state.hostout_biid,
      hostout_kdmsn: this.state.jenis_mesin,
      hostout_kdkrt: this.state.jenis_kartu,
      hostout_tglefektifmesin: this.state.hostout_tglefektifmesin,
      hostout_penarikanmesin: this.state.hostout_penarikanmesin,
      hostout_vacc_id: '0',
      hostout_userid: '0',
      
    };
    console.log(payload);
    let data = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      json: true,
      body: JSON.stringify(payload),
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    });

    if (data) {
      this.showNotification(
        'Data Finance untuk Outlet ' +
          this.state.out_name +
          ' berhasil disimpan',
      );
      this.searchInputValue(this.state.outcode);
      this.setState({
        tableKartuKreditDisplay: 'inline',
        tableSetoranTunaiDisplay: 'd-none',
        modal_addkartuKredit: false,
        modal_nested: false,
        jenisTransaksiValue: this.state.jenisTransaksiValue,
      });
    } else {
      alert(
        'Data Finance untuk Outlet ' +
          this.state.out_name +
          ' sudah pernah ada',
      );
    }

    this.setState({
      isLoading: false,
      buttonAddDisabled: true,
      buttonEditted: 'inline',
      displaySimpanButton: 'd-none',
    });
    console.log('Simpan Host: Response: ' + data);
  };

  handleSimpanSetoranButton = async () => {
    console.log('Simpan: Starting...');
    this.setState({
      isLoading: true,
    });

    const url = 'https://api.docnet.id/CHCMasterH/MasterOutlet/TambahFinance/' + this.state.outcode;
    console.log(url);
    var payload = {
      hostout_jenistransaksi: this.state.jenisTransaksiValue,
      hostout_cabangbankid: this.state.hostout_cabangbankid,
      hostout_atasnama: 'PT PERINTIS PELAYANAN PARIPURNA',
      hostout_norekening: this.state.hostout_norekening,
      hostout_vacc_id: this.state.hostout_vacc_id,
      hostout_biid: this.state.hostout_biid,
      hostout_hostcode: '0',
      hostout_kdmsn: '1',
      hostout_kdkrt: '1',
      hostout_nomerchant: '0',
      hostout_tglefektifmesin: '2000-01-01',
      hostout_penarikanmesin: '2000-01-01',

      hostout_userid: '0',
    };
    console.log(payload);
    let data = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      json: true,
      body: JSON.stringify(payload),
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    });

    if (data) {
      this.searchInputValue(this.state.outcode);
      this.setState({
        jenisTransaksiValue: this.state.jenisTransaksiValue,
        modal_addSetoran: false,
        modal_nested: false,
        isLoading: false,
        buttonAddDisabled: true,
        buttonEditted: 'inline',
        displaySimpanButton: 'd-none',
        tableKartuKreditDisplay: 'd-none',
        tableSetoranTunaiDisplay: 'inline',
      });
      this.showNotification(
        'Data Finance untuk Outlet ' +
          this.state.out_name +
          ' berhasil disimpan',
      );
    } else {
      alert(
        'Data Finance untuk Outlet ' +
          this.state.out_name +
          ' sudah pernah ada',
      );
    }
  };

  getTableMesin() {
    var url = hostUrl + `/TampilSemuaDataMesin`;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        let jenisMesin = data.map(mesin => {
          return {
            value: mesin.msn_code,
            display: mesin.msn_jns,
          };
        });
        this.setState({
          isLoading: false,
          jenisMesins: [{ value: '', display: 'Pilih Mesin' }].concat(
            jenisMesin,
          ),
        });
      })
      .catch(() => {
        console.log('ERROR table mesin');
      });
  }

  getHost() {
    var url = hostUrl +`/TampilDataHost/host?krt=${this.state.jenis_kartu}&msn=${this.state.jenis_mesin}`;
    fetch(url)
      .then(response => {
        console.log('consolegetHost' + url);
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        this.setState({
          isLoading: false,
          hostout_hostcode: data[0].host_code,
        });
      })
      .catch(() => {
        console.log('ERROR table HOST WOI !');
      });
  }

  getTableNomorRekening(bi_id) {
    var url = `https://api.docnet.id/CHCMasterBantuan/TampilDataBankIntern/kode=${bi_id}`;
    console.log('NomorRekening: ' + url);
    fetch(url)
      .then(response => response.json())
      
      .then(data => {
        this.setState(
          {
            isLoading: false,
            dataAtasNamas: data,
          },
          () => console.log('TEST: ' + JSON.stringify(data[0])),
        );
      });
  }

  getTableJenisKartu() {
    var url = hostUrl + `/TampilSemuaDataBankKartu`;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        let jenisKartu = data.map(jenisKartu => {
          return {
            value: jenisKartu.krt_code,
            display: jenisKartu.krt_jns,
          };
        });

        this.setState({
          isLoading: false,
          jenisKartus: [{ value: '', display: 'Pilih Jenis Kartu' }].concat(
            jenisKartu,
          ),
        });
      })
      .catch(() => {
        console.log('ERROR table jenis kartu');
      });
  }

  getTableSemuaDataBank(evt) {
    var url = `https://api.docnet.id/CHCMasterBantuan/TampilSemuaDataBank`;
    console.log('MASUKGAN');
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        let dataVACC = data[0].vacc_account[evt].map(dataVACC => {
          console.log(dataVACC);
          console.log('masukVrtualaccountbosku');
          return {
            value: dataVACC.vacc_id,
            display: dataVACC.vacc_nomorrek,
          };
        });

        this.setState({
          isLoading: false,
          dataBanks: [
            { value: '', display: 'Pilih Jenis Virtual Account' },
          ].concat(dataVACC),
        });
      })
      .catch(() => {
        console.log('ERROR Virtual account');
      });
  }

  getTableVirtualAccount(hostout_biid) {
    var url = `https://api.docnet.id/CHCMasterBantuan/TampilDataVACC/kode=${hostout_biid}`;
    console.log('getTableVirtualAccount' + url);
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        let dataVirtualAccount = data.map(dataVirtualAccount => {
          console.log(dataVirtualAccount);
          return {
            value: dataVirtualAccount.vacc_id,
            display: dataVirtualAccount.vacc_nomorrek,
          };
        },()=>console.log("dataVirtualAccount" +dataVirtualAccount ));

        this.setState({
          hostout_vacc_id: this.state.hostout_vacc_id,
          isLoading: false,
          dataVirtualAccounts: [
            { value: '0', display: 'Pilih Nomor Virtual Account' },
          ].concat(dataVirtualAccount),
        },()=>console.log(this.state.hostout_vacc_id+"hostout_vacc_idsetState"));
      })
      .catch(() => {
        console.log('ERROR Pencairan');
      });
  }

  getTablePencairan() {
    var url = `https://api.docnet.id/CHCMasterBantuan/TampilSemuaDataBank`;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('RESPONSE NOT FOUND');
        }
      })
      .then(data => {
        let dataBank = data.map(dataBank => {
          console.log(dataBank);
          return {
            value: dataBank.bank_id,
            display: dataBank.bank_name,
          };
        });

        this.setState({
          isLoading: false,
          dataBanks: [{ value: '', display: '' }].concat(dataBank),
        });
      })
      .catch(() => {
        console.log('ERROR Pencairan');
      });
  }
  getsearchOutletList = () => {
    this.setState({
      isLoading: true,
    });
    console.log(this.state.outletSearch);
    var url = hostUrl + `/CariDataOutletTanpaKota/${this.state.outletSearch}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState(
          {
            searchOutletList: data,
            isLoading: false,
          },
          () => console.log('searchOutletList: Data: ' + JSON.stringify(data)),
        );
      });
  };
  updateInputValueSearchOutlet = evt => {
    console.log(evt.target);
    this.setState({
      outletSearch: evt.target.value.replace(/[^\w\s]/gi, '').toUpperCase(),
    });
  };

  handleNoFinance(data) {
    if (data[0].kredit) {
      console.log('Tidak ada Finance');
      this.setState({
        hostout_outcode: data[0].out_code,
        out_name: data[0].out_name,
        sewa_perawal: '',
        sewa_perakhir: '',
        sewa_perbayar: '',
        sewa_startbayar: '',
        sewa_dp: '',
        sewa_frekdp: '',
        sewa_nilaisewa: '',
        sewa_totperiode: '',
        sewa_total: '',
        jenis_mesin: '',
        jenis_kartu: '',
        cabang_bank: '',
        hostout_atasnama: '',
        hostout_hostcode: '',
        hostout_vacc_id: '',
        hostout_tglefektifmesin: '',
        hostout_penarikanmesin: '',
        hostout_norekening: '',
        hostout_nomerchant: '',
        hostout_cabangbankid: '', 
        buttonDetailDisabled: false,
        displayAddButton: '',
        displayEditButton: 'd-none',
        displaySimpanButton: 'd-none',
        displayOkButton: 'd-none',
        buttonAddDisabled: true,
        buttonAddDisabledSetoranTunai: true,
        tableSetoranTunaiDisplay: 'd-none',
        tambahtableSetoranTunai: 'd-none',
        tambahtableKartuKredit: 'd-none',
        isLoading: false,
      });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  enableStocktakeWhenNotFound = () => {
    var inputSearched = document.getElementById('inputSearch');
    var onClickSearched = document.getElementById('onClickSearch');
    var onClickSearchLogoed = document.getElementById('onClickSearchLogo');
    var buttonOKd = document.getElementById('buttonOK');
    var buttonEditted = document.getElementById('buttonEdit');
    var jenisStocktaked = document.getElementById('jenisStocktake');
    var pagiTimed = document.getElementById('pagiTime');
    var soreTimed = document.getElementById('soreTime');
    var lamaFinalStocktaked = document.getElementById('lamaFinalStocktake');
    this.setState({
      modal_stocktakeNotFound: false,
    });
    onClickSearchLogoed.style.display = 'none';
    inputSearched.style.display = 'none';
    onClickSearched.style.display = 'none';
    buttonEditted.style.display = 'none';
    buttonOKd.style.display = 'inline';
    jenisStocktaked.disabled = false;
    pagiTimed.disabled = false;
    soreTimed.disabled = false;
    lamaFinalStocktaked.disabled = false;
  };

  getListbyEye(
    host,
    hostout_atasnama,
    hostout_nomerchant,
    hostout_tglefektifmesin,
    hostout_penarikanmesin,
    vacc,
    hostout_kdmsn,
    hostout_kdkrt,
    hostout_vacc_id,
  ) {
    this.setState({
      host: host,
      hostout_atasnama: hostout_atasnama,
      hostout_nomerchant: hostout_nomerchant,
      hostout_tglefektifmesin: hostout_tglefektifmesin,
      hostout_penarikanmesin: hostout_penarikanmesin,
      vacc: vacc,
      hostout_kdmsn: hostout_kdmsn,
      hostout_kdkrt: hostout_kdkrt,
      hostout_vacc_id: hostout_vacc_id,
      modal_kartuKredit: true,
    });
  }
  enableClickEdit() {
    //tombol
    var buttonEditted = document.getElementById('buttonEdit');
    var buttonOKd = document.getElementById('buttonOK');

    //inputan
    var lamaFinalStocktaked = document.getElementById('lamaFinalStocktake');
    var jenisStocktaked = document.getElementById('jenisStocktake');
    var pagiTimed = document.getElementById('pagiTime');
    var soreTimed = document.getElementById('soreTime');

    buttonEditted.style.display = 'none';
    buttonOKd.style.display = 'inline';
    lamaFinalStocktaked.disabled = false;
    jenisStocktaked.disabled = false;
    pagiTimed.disabled = false;
    soreTimed.disabled = false;
  }

  //function untuk melakukan search pada saat menekan enter
  enterPressed = (event, search) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.getsearchOutletList();
    }
  };

  setSearchInputState = evt => {
    this.setState({
      searchInputtedName: evt.target.value,
    });
  };

  //ketika melakukan search, state input-an yang masuk harus uppercase dan tidak boleh special character

  //--------------------------------------------------------- DELETE --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

  // 1.Pelemparan parameter ke Backend dimana data apa saja yang akan di hapus
  deleteSetoran = hostout_runningid => async () => {
    var url = hostUrl + `/HapusFinance/${hostout_runningid}`;
    var payload = {
      hostout_userid: '0',
    };
    let data = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      //2.Ketika sudah terespond oleh backend , maka frontend akan melakukan hal ini
      .then(response => {
        if (response.ok) {
          this.state.backdrop = false;
          this.searchInputValue(this.state.outcode);
          this.setState({
            modal_delete: false,
            modal_nested: false,
            tableKartuKreditDisplay: 'd-none',
            tableSetoranTunaiDisplay: 'inline',
          });
          return response.json();
        }
      });
    if (data) {
      this.showNotification('Data Berhasil di Hapus');
    }
  };


  deleteFinanceKredit = hostout_runningid => async () => {
    console.log("FinanceKredit DELETE  : "+ hostout_runningid)
    var url = hostUrl + `/HapusFinance/${hostout_runningid}`;
    var payload = {
      hostout_userid: '0',
    };
    let data = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      //2.Ketika sudah terespond oleh backend , maka frontend akan melakukan hal ini
      .then(response => {
        if (response.ok) {
          this.searchInputValue(this.state.outcode);
          this.state.backdrop = false;
          this.setState({
            modal_delete_kredit: false,
            modal_nested: false,
            tableKartuKreditDisplay: 'inline',
            tableSetoranTunaiDisplay: 'd-none'
          });
    
          return response.json();
        }
      });
    if (data) {
      this.showNotification('Data Berhasil di Hapus');
    }
  };
  // set awal pada saat membuka delete
  openModalWithItemID(idEkspedisi) {
    this.setState({
      modal_delete: true,
      activeItem_Id: idEkspedisi,
    });
  }

  //render biasa nya di-isi untuk desain HTML
  render() {
    // var currOpen = new Date();
    // currOpen.setDate(currOpen.getDate() + 14);
    // var dateOpen = currOpen.toISOString().substr(0, 10);

    const { isLoading, setoranTransaksi, kredit } = this.state;

    return (
      <Page
        title="Outlet Finance"
        breadcrumbs={[{ name: 'OutletFinance', active: true }]}
        className="Outlet Finance Page"
      >
        <Modal
          isOpen={this.state.modal_outletNotFound}
          toggle={this.toggle('outletNotFound')}
          className={this.props.className}
        >
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <Alert color="success">
                    <Typography type="h4" className="alert-heading">
                      Outlet Tidak Ditemukan !
                    </Typography>
                  </Alert>
                </CardHeader>

                <CardBody>
                  <Label>Ingin Membuat Outlet ?</Label>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <ModalFooter>
            <Button color="primary" href={'./Outlet'}>
              {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
              Ya
            </Button>{' '}
            <Button color="secondary" onClick={this.toggle('outletNotFound')}>
              Batal
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.modal_stocktake}
          toggle={this.toggle('stocktakeNotFound')}
          className={this.props.className}
          backdrop="static"
          keyboard="false"
        >
          <ModalHeader>
            <Label>Outlet Tidak Mempunyai Data Camera !</Label>
          </ModalHeader>
          <ModalBody>
            <Label>Ingin Membuat Data Camera ?</Label>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={this.enableStocktakeWhenNotFound}
            >
              Ya
            </Button>

            <Button
              color="secondary"
              onClick={this.toggle('stocktakeNotFound')}
            >
              Tidak
            </Button>
          </ModalFooter>
        </Modal>

        <Card className="mb-3">
          <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />
          {/* ======================================INPUT SEARCH============================== */}
          {/* <CardHeader className="d-flex justify-content-between">
            <Form inline className="cr-search-form">
             */}
              {/* ======================================CLICK SEARCH============================== */}
{/* 
              <Card id="onClickSearchLogo" className="d-flex">
                <Button
                  id="onClickSearch"
                  onSubmit={e => e.preventDefault()}
                  onClick={()=>this.onClickSearchOutlet()}
                >
                  <MdSearch></MdSearch>{' '}
                </Button>
              </Card> */}
            {/* </Form> */}

            {/* ======================================KETIKA TAMBAH DATA============================== */}
           
          {/* </CardHeader> */}

          <CardBody id="selectedStocktake">
            <Form>
              {/* =================================  =================================*/}

              <Row className="mt-3">
                <Label sm={3} md={2} style={{ fontWeight: 'bold' }}>
                  Outlet
                </Label>

                <Col xs={4} md={2}>
                  {/* outlet id */}
                  <Input
                    id="viewinsertOutletID"
                    value={this.state.outcode}
                    disabled
                    maxLength="4"
                  ></Input>
                </Col>

                {/* Perusahaan */}
                <Col xs={10} md={5}>
                  <Input
                    value={this.state.out_name}
                    disabled
                    maxLength="4"
                  ></Input>
                </Col>

                <Col>
                  <Button
                    id="onClickSearch"
                    onSubmit={e => e.preventDefault()}
                    onClick={()=>this.onClickSearchOutlet()}
                  >
                    <MdSearch></MdSearch>{' '}
                  </Button>
                </Col>

                <Row>
                <Col xs={8} md={8}>
                  <Button
                    onClick={() => this.addsetoranTunai(this.state.outcode)}
                    id="displayEditButton"
                    className={this.state.modaladdSetoran}
                  >
                    ADD SETORAN
                  </Button>
  
                  <Button
                    onClick={() => this.addKartuKredit()}
                    id="displayEditButton"
                    className={this.state.modaladdkartuKredit}
                  >
                    ADD KREDIT
                  </Button>
                </Col>
              </Row>
              </Row>

              <Row>
                <Col xs={4} md={2}>
                  <Label>Jenis Transaksi</Label>
                </Col>

                <Col xs={10} md={4}>
                  <Input
                    disabled={this.state.buttonAddDisabledJenisTransaksi}
                    type="select"
                    onChange={evt => this.updateJenisTransaksi(evt)}
                    id="jenisTransaksi"
                    value={this.state.jenisTransaksiValue}
                  >
                    <option
                    disabled = {this.state.disabledPilihTransaksi}
                    >Pilih Transaksi</option>
                    <option id="S" value="S">
                      Setoran Tunai
                    </option>
                    <option id="K" value="K">
                      Kartu Kredit
                    </option>
                  </Input>
                </Col>
              </Row>
              {/* ================================= finance =================================*/}

              <Table
                bordered="3"
                id="tableSetoranTunai"
                className={this.state.tableSetoranTunaiDisplay}
              >
                <thead>
                  <tr align="center">
                    <th className="th-sm">Nama Bank</th>
                    <th class="th-sm">Atas Nama</th>
                    <th class="th-sm">No. Rekening Induk</th>
                    <th class="th-sm">No. Virtual Account</th>
                    <th class="th-sm">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {setoranTransaksi.map(bank => (
                    <tr>
                      <td align="center">{bank.Bank}</td>
                      <td align="center">{bank.hostout_atasnama}</td>
                      <td align="center">{bank.hostout_norekening}</td>
                      <td align="center">{bank.vacc_norek}</td>
                      <td align="center">
                      
                        <div>
                          <Button
                            style={{
                              marginRight: '7px', cursor: 'pointer' ,
                              borderStyle: 'none',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onClick={() =>
                              this.updateSetoran(
                                bank.Bank,
                                bank.hostout_norekening,
                                bank.hostout_biid,
                                bank.hostout_vacc_id,
                                bank.hostout_runningid,
                                bank.bank_id,
                                bank.hostout_cabangbankid,
                                bank.hostout_outcode,
                                bank.hostout_nomerchant,
                                bank.hostout_tglefektifmesin,
                                bank.hostout_penarikanmesin,
                                
                              )
                            }
                            color="warning"
                            size="sm"
                          >
                          EDIT
                          </Button>

                          <Button
                            style={{
                              background: '#FF0000',
                              borderStyle: 'none',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            size="sm"
                            onClick={() =>
                              this.handleDeleteSetoran(bank.hostout_runningid)
                            }
                          >
                            <MdDelete></MdDelete>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Table
                bordered="3"
                id="tableKartuKredit"
                className={this.state.tableKartuKreditDisplay}
              >
                <thead>
                  <tr align="center">
                    <th class="th-sm">Jenis Kartu</th>
                    <th class="th-sm">Nama Mesin</th>
                    <th class="th-sm">Rate % </th>
                    <th class="th-sm">Tgl Efektif Rate</th>
                    <th class="th-sm">Nama Bank</th>
                    <th class="th-sm">No Rekening</th>
                    <th class="th-sm">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {kredit.map(banks => (
                    <tr>
                      <td align="center">{banks.jenis_mesin}</td>
                      <td align="center">{banks.jenis_kartu}</td>

                      <td align="center">{banks.host_rate}</td>

                      <td align="center">{banks.host_tglefektif}</td>

                      <td align="center">{banks.Bank}</td>

                      <td align="center">{banks.hostout_norekening}</td>

                      <td align="center">
                        <div>
                          <Button
                          style={{
                            marginRight: '7px', cursor: 'pointer' ,
                            borderStyle: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                            onClick={() =>
                              this.updateModalWithItemID(
                                banks.hostout_kdmsn,
                                banks.hostout_kdkrt,
                                banks.hostout_hostcode,
                                banks.hostout_cabangbankid,
                                banks.hostout_atasnama,
                                banks.hostout_norekening,
                                banks.hostout_nomerchant,
                                banks.hostout_vacc_id,
                                banks.hostout_tglefektifmesin,
                                banks.hostout_penarikanmesin,
                                banks.hostout_runningid,
                                banks.Bank,
                                banks.hostout_outcode
                                
                              )
                            }
                            
                            color="warning"
                            size="sm"
                          >EDIT</Button>


                          <Button
                          style={{
                            background: '#FF0000',
                            borderStyle: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          size="sm"
                          onClick={() =>
                            this.handleDeleteKredit(banks.hostout_runningid)
                          }
                        >
                          <MdDelete></MdDelete>
                        </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form>

            <Modal
              isOpen={this.state.modal_addSetoran}
              toggle={this.toggle('addSetoran')}
              className={this.state.modaladdSetoran + ' modal-dialog-centered'}
              id="modaladdSetoran"
              size="lg"
              onClosed={this.handleClose}
            >
              <ModalHeader>
                <Label>Add Data Setoran</Label>
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col xs={8} md={5}>
                    <Label>Bank Pencairan</Label>
                  </Col>
                  <Col xs={8} md={5}>
                    <FormGroup>
                      <UncontrolledDropdown direction="down">
                        <DropdownToggle caret>
                          {this.state.hostout_cabangbankname}
                        </DropdownToggle>
                        <DropdownMenu className="scrollable">
                          {this.state.dataBanks.map(dataBank => (
                            <DropdownItem
                              style={{ maxHeight: '40px' }}
                              name={dataBank.display}
                              value={dataBank.value}
                              onClick={event => this.handleNoRekening(event)}
                            >
                              {dataBank.display}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={8} md={5}>
                    <Label>Pilih No Rekening</Label>
                  </Col>
                  <Col xs={8} md={5}>
                    <FormGroup>
                      <UncontrolledDropdown direction="down">
                        <DropdownToggle
                          disabled={this.state.disableddropdownNoRekening}
                          caret
                        >
                          {this.state.hostout_norekening}
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.dataAtasNamas.map(dataBank => (
                            <DropdownItem
                              onFocus={e => {
                                e.target.size = 5;
                              }}
                              name={dataBank.bi_nomorrek}
                              value={dataBank.bi_cabid + '@' + dataBank.bi_id}
                              onClick={event =>
                                this.handleNoVirtualAccount(event)
                              }
                            >
                              {dataBank.bi_nomorrek}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col xs={8} md={5} class="float-right">
                    <Label>No Virtual Account</Label>
                  </Col>

                  <Col xs={8} md={5}>
                    <Input
                      onChange={evt => this.jenisVACCInputValue(evt)}
                      value={this.state.hostout_vacc_id}
                      type="select"
                      id="hostout_vacc_id"
                      defaultValue="0"
                      disabled={this.state.disableddropdownVirtualAccount}
                    >
                      {this.state.dataVirtualAccounts.map(
                        dataVirtualAccount => (
                          <option
                            key={dataVirtualAccount.value}
                            value={dataVirtualAccount.value}
                          >
                            {dataVirtualAccount.display}
                          </option>
                        ),
                      )}
                    </Input>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  id="buttonSimpanEdit"
                  color="primary"
                  onClick={this.toggle('nested')}
                  disabled={this.state.disabledButtonSimpan}
                >
                  Simpan
                </Button>
                <Modal
                  isOpen={this.state.modal_nested}
                  toggle={this.toggle('nested')}
                >
                  <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                  <ModalBody>
                    Apakah Anda yakin ingin menyimpan data ini?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      onClick={() =>
                        this.handleSimpanSetoranButton(
                          this.state.searchInputtedName,
                        )
                      }
                      color="primary"
                      disabled={this.state.isLoading}
                    >
                      Ya
                    </Button>{' '}
                    <Button color="primary" onClick={this.toggle('nested')}>
                      Tidak
                    </Button>
                  </ModalFooter>
                </Modal>{' '}
                <Button color="primary" onClick={this.toggle('addSetoran')}>
                  Batal
                </Button>
              </ModalFooter>
            </Modal>

            <Modal
              isOpen={this.state.modal_editSetoran}
              toggle={this.toggle('editSetoran')}
              className={this.state.modaleditSetoran + ' modal-dialog-centered'}
              id="modaleditSetoran"
              size="lg"
              onClosed={this.handleClose}
            >
              <ModalHeader>
                <Label>Edit Data Setoran</Label>
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col xs={8} md={5}>
                    <Label>Bank Pencairan</Label>
                  </Col>
                  <Col xs={8} md={5}>
                    <FormGroup>
                      <UncontrolledDropdown direction="down">
                        <DropdownToggle caret>
                          {this.state.hostout_cabangbankname}
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.dataBanks.map(dataBank => (
                            <DropdownItem
                              name={dataBank.display}
                              value={dataBank.value}
                              onClick={event => this.handleNoRekening(event)}
                            >
                              {dataBank.display}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={8} md={5}>
                    <Label>Pilih No Rekening</Label>
                  </Col>
                  <Col xs={8} md={5}>
                    <FormGroup>
                      <UncontrolledDropdown direction="down">
                        <DropdownToggle
                          caret
                        >
                          {this.state.hostout_norekening}
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.dataAtasNamas.map(dataBank => (
                            <DropdownItem
                              name={dataBank.bi_nomorrek}
                              value={dataBank.bi_cabid + '@' + dataBank.bi_id}
                              onClick={event =>
                                this.handleNoVirtualAccount(event)
                              }
                            >
                              {dataBank.bi_nomorrek}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={8} md={5} class="float-right">
                    <Label>No Virtual Account</Label>
                  </Col>

                  <Col xs={8} md={5}>
                    <Input
                  
                      onChange={evt => this.jenisVACCInputValue(evt)}
                      value={this.state.hostout_vacc_id}
                      type="select"
                      id="hostout_vacc_id"
                    >
                      {this.state.dataVirtualAccounts.map(
                        dataVirtualAccount => (
                          <option
                            key={dataVirtualAccount.value}
                            value={dataVirtualAccount.value}
                          >
                            {dataVirtualAccount.display}
                          </option>
                        ),
                      )}
                    </Input>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  id="buttonSimpanEdit"
                  color="primary"
                  onClick={this.toggle('nested')}
              
                >
                  Simpan
                </Button>
                <Modal
                  isOpen={this.state.modal_nested}
                  toggle={this.toggle('nested')}
                >
                  <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                  <ModalBody>
                    Apakah Anda yakin ingin mengubah data ini?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      onClick={() =>
                        this.editSetoran(this.state.hostout_runningid)
                      }
                      color="primary"
                      disabled={this.state.isLoading}
                    >
                   
                      Ya
                    </Button>{' '}
                    <Button color="primary" onClick={this.toggle('nested')}>
                      Tidak
                    </Button>
                  </ModalFooter>
                </Modal>{' '}
                <Button color="primary" onClick={this.toggle('editSetoran')}>
                  Batal
                </Button>
              </ModalFooter>
            </Modal>

            <Modal
              isOpen={this.state.modal_addkartuKredit}
              toggle={this.toggle('addKartuKredit')}
              className={this.state.modaladdkartuKredit}
              size="lg"
              onClosed={this.handleClose}
              onExit={this.handleClose}
            >
              <ModalHeader>
                <Label>Add Data Kartu Kredit</Label>
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col xs={8} md={5}>
                    <Label>Mesin</Label>
                  </Col>

                  <Col xs={8} md={5}>
                    <Input
                      type="select"
                      value={this.state.jenis_mesin}
                      onChange={evt => this.jenisMesinInputValue(evt)}
                      id="jenis_mesin"
                    >
                      {this.state.jenisMesins.map(mesin => (
                        <option key={mesin.value} value={mesin.value}>
                          {mesin.display}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>

                <Row>
                  <Col xs={8} md={5}>
                    <Label>Jenis Kartu</Label>
                  </Col>

                  <Col xs={8} md={5}>
                    <Input
                      type="select"
                      onChange={evt => this.jenisKartuInputValue(evt)}
                      value={this.state.jenis_kartu}
                      id="jenis_kartu"
                     
                    >
                      {this.state.jenisKartus.map(jenisKartu => (
                        <option key={jenisKartu.value} value={jenisKartu.value}>
                          {jenisKartu.display}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>

                <Row>
                  <Col xs={8} md={5}>
                    <Label>Bank Pencairan</Label>
                  </Col>
                  <Col xs={8} md={5}>
                    <FormGroup>
                      <UncontrolledDropdown direction="down">
                        <DropdownToggle
                          caret
                 
                        >
                          {this.state.hostout_cabangbankname}
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.dataBanks.map(dataBank => (
                            <DropdownItem
                              name={dataBank.display}
                              value={dataBank.value}
                              onClick={event => this.handleNoRekening(event)}
                            >
                              {dataBank.display}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={8} md={5}>
                    <Label>Pilih No Rekening</Label>
                  </Col>
                  <Col xs={8} md={5}>
                    <FormGroup>
                      <UncontrolledDropdown direction="down">
                        <DropdownToggle
                          disabled={this.state.disabledPilihNoRekening}
                          caret
                        >
                          {this.state.hostout_norekening}
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.dataAtasNamas.map(dataBank => (
                            <DropdownItem
                              name={dataBank.bi_nomorrek}
                              value={dataBank.bi_cabid + '@' + dataBank.bi_id}
                              onClick={event =>
                                this.handleNoVirtualAccount(event)
                              }
                            >
                              {dataBank.bi_nomorrek}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={8} md={5}>
                    <Label>No Merchant</Label>
                  </Col>

                  <Col xs={8} md={5}>
                    <Input
                      onChange={evt => this.updateInputValue(evt)}
                      value={this.state.hostout_nomerchant}
                      id="hostout_nomerchant"
                    
                    ></Input>
                  </Col>
                </Row>

                <Row>
                  <Col xs={8} md={5}>
                    <Label>Tgl Efektif Mesin</Label>
                  </Col>

                  <Col xs={8} md={5} class="float-right">
                    <Input
                      type="date"
                      onChange={evt => this.handleSik2StartDateInputChange(evt)}
                      name="hostout_tglefektifmesin"
                      value={this.state.hostout_tglefektifmesin}
                      id="hostout_tglefektifmesin"
                      disabled={this.state.disabledEfektifMesin}
                      invalid={this.state.hostout_tglefektifmesinInvalid}
                      valid={this.state.hostout_tglefektifmesinValid}
                    ></Input>
                  </Col>
                </Row>

                <Row>
                  <Col xs={5} md={5}>
                    <Label>Tgl Penarikan Mesin</Label>
                  </Col>

                  <Col xs={5} md={5} class="float-right">
                    <Input
                      type="date"
                      onChange={evt => this.handleSik2EndDateInputChange(evt)}
                      value={this.state.hostout_penarikanmesin}
                      name="hostout_penarikanmesin"
                      id="hostout_penarikanmesin"
                      disabled={this.state.disabledPenarikanMesin}
                      invalid={this.state.hostout_penarikanmesinInvalid}
                      valid={this.state.hostout_penarikanmesinValid}
                    ></Input>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  id="buttonSimpanEdit"
                  color="primary"
                  onClick={this.toggle('nested')}
                  disabled={this.state.disabledButtonSave}
                >
                  Simpan
                </Button>
                <Modal
                  isOpen={this.state.modal_nested}
                  toggle={this.toggle('nested')}
                >
                  <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                  <ModalBody>
                    Apakah Anda yakin ingin menyimpan data ini?
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      onClick={() => this.handleSimpanKreditButton()}
                      color="primary"
                    >
                      {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                      Ya
                    </Button>{' '}
                    <Button color="primary" onClick={this.toggle('nested')}>
                      Tidak
                    </Button>
                  </ModalFooter>
                </Modal>{' '}
                <Button color="primary" onClick={this.toggle('addkartuKredit')}>
                  Batal
                </Button>
              </ModalFooter>
            </Modal>

            <Modal
              isOpen={this.state.modal_editkartuKredit}
              toggle={this.toggle('editkartuKredit')}
              size="lg"
              onExit={this.handleClose}
            >
              <ModalHeader>
                <Label>Edit Data Kartu Kredit</Label>
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col xs={8} md={5}>
                    <Label>Mesin</Label>
                  </Col>

                  <Col xs={8} md={5}>
                    <Input
                      type="select"
                      value={this.state.jenis_mesin}
                      onChange={evt => this.jenisMesinInputValue(evt)}
                      id="jenis_mesin"
                    >
                      {this.state.jenisMesins.map(mesin => (
                        <option key={mesin.value} value={mesin.value}>
                          {mesin.display}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>

                <Row>
                  <Col xs={8} md={5}>
                    <Label>Jenis Kartu</Label>
                  </Col>

                  <Col xs={8} md={5}>
                    <Input
                      type="select"
                      onChange={evt => this.jenisKartuInputValue(evt)}
                      value={this.state.jenis_kartu}
                      id="jenis_kartu"
                    >
                      {this.state.jenisKartus.map(jenisKartu => (
                        <option key={jenisKartu.value} value={jenisKartu.value}>
                          {jenisKartu.display}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>

                <Row>
                  <Col xs={8} md={5}>
                    <Label>Bank Pencairan</Label>
                  </Col>
                  <Col xs={8} md={5}>
                    <FormGroup>
                      <UncontrolledDropdown direction="down">
                        <DropdownToggle
                          caret
                      
                        >
                          {this.state.hostout_cabangbankname}
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.dataBanks.map(dataBank => (
                            <DropdownItem
                              name={dataBank.display}
                              value={dataBank.value}
                              onClick={event => this.handleNoRekening(event)}
                            >
                              {dataBank.display}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={8} md={5}>
                    <Label>Pilih No Rekening</Label>
                  </Col>
                  <Col xs={8} md={5}>
                    <FormGroup>
                      <UncontrolledDropdown direction="down">
                        <DropdownToggle caret>
                          {this.state.hostout_norekening}
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.dataAtasNamas.map(dataBank => (
                            <DropdownItem
                              name={dataBank.bi_nomorrek}
                              value={dataBank.bi_cabid + '@' + dataBank.bi_id}
                              onClick={event =>
                                this.handleNoVirtualAccount(event)
                              }
                            >
                              {dataBank.bi_nomorrek}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={8} md={5}>
                    <Label>No Merchant</Label>
                  </Col>

                  <Col xs={8} md={5}>
                    <Input
                      onChange={evt => this.updateInputValue(evt)}
                      value={this.state.hostout_nomerchant}
                      id="hostout_nomerchant"
                    ></Input>
                  </Col>
                </Row>

                <Row>
                  <Col xs={8} md={5}>
                    <Label>Tgl Efektif Mesin</Label>
                  </Col>

                  <Col xs={8} md={5} class="float-right">
                    <Input
                      type="date"
                      onChange={evt => this.handleSik2StartDateInputChange(evt)}
                      name="hostout_tglefektifmesin"
                      value={this.state.hostout_tglefektifmesin}
                      id="hostout_tglefektifmesin"
                      invalid={this.state.hostout_tglefektifmesinInvalid}
                      valid={this.state.hostout_tglefektifmesinValid}
                    ></Input>
                  </Col>
                </Row>

                <Row>
                  <Col xs={5} md={5}>
                    <Label>Tgl Penarikan Mesin</Label>
                  </Col>

                  <Col xs={5} md={5} class="float-right">
                    <Input
                      type="date"
                      onChange={evt => this.handleSik2EndDateInputChange(evt)}
                      value={this.state.hostout_penarikanmesin}
                      name="hostout_penarikanmesin"
                      id="hostout_penarikanmesin"
                      invalid={this.state.hostout_penarikanmesinInvalid}
                      valid={this.state.hostout_penarikanmesinValid}
                    ></Input>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  id="buttonSimpanEdit"
                  color="primary"
                  onClick={this.toggle('nested')}
                >
                  Simpan
                </Button>
                <Modal
                  isOpen={this.state.modal_nested}
                  toggle={this.toggle('nested')}
                >
                  <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                  <ModalBody>
                    Apakah Anda yakin ingin mengubah data ini?
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      onClick={() =>
                        this.editKartuKredit(
                          this.state.jenis_mesin,
                          this.state.jenis_kartu,
                          this.state.hostout_hostcode,
                          this.state.hostout_cabangbankid,
                          this.state.hostout_atasnama,
                          this.state.hostout_norekening,
                          this.state.hostout_nomerchant,
                          this.state.hostout_vacc_id,
                          this.state.hostout_tglefektifmesin,
                          this.state.hostout_penarikanmesin,
                          this.state.hostout_runningid,
                          this.state.hostout_outcode,
                          this.state.hostout_cabangbankname
                        )
                      }
                      color="primary"
                    >
                      {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                      Ya
                    </Button>{' '}
                    <Button color="primary" onClick={this.toggle('nested')}>
                      Tidak
                    </Button>
                  </ModalFooter>
                </Modal>{' '}
                <Button
                  color="primary"
                  onClick={this.toggle('editkartuKredit')}
                >
                  Batal
                </Button>
              </ModalFooter>
            </Modal>

            {/* ---------------------------------------- MODAL CARI OUTLET --------------------------------------------- */}
            <Modal
              isOpen={this.state.modal_outletSearch}
              toggle={this.toggle('outletSearch')}
              className="modal-dialog-scrollable modal-dialog-centered"
              size="lg"
              backdrop="static"
            >
              <ModalHeader>Search Outlet</ModalHeader>
              <ModalBody>
                <InputGroup>
                  <Input
                    innerRef ={this.searchInnerRef}
                    name="outletSearchInput"
                    placeholder="Cari OutletID atau OutletName"
                    value={this.state.outletSearch}
                    disabled={this.state.isLoading}
                    onKeyPress={event => this.enterPressed(event)}
                    onChange={this.updateInputValueSearchOutlet}
                  />
                  <InputGroupAddon addonType="append">
                    <Button onClick={() => this.getsearchOutletList()}>
                      <MdSearch />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
           
                <ListGroup className="mt-3">
                  <ListGroupItem
                    className={
                      this.state.searchOutletList.length > 0 ? '' : 'd-none'
                    }
                  >
                    <p class="text-center font-weight-bold">
                      Pilih Salah Satu !
                    </p>
                  </ListGroupItem>
                  {this.state.searchOutletList.map(outlist => (
                    <ListGroupItem
                      disabled={this.state.disableClickSearchOutlet}
                      tag="button"
                      action
                      name={outlist.out_code}
                      value={outlist.out_name}
                      onClick={() => this.searchInputValue(outlist.out_code)}
                    >
                      {outlist.out_code + ' - ' + outlist.out_name}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  style={{
                    background: '#FF0000',
                    borderStyle: 'none',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  disabled={this.state.isLoading}
                  onClick={this.toggle('outletSearch')}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>

            <Modal
              isOpen={this.state.modal_delete}
              toggle={this.toggle('delete')}
              className={this.props.className}
            >
              <ModalHeader toggle={this.toggle('delete')}>
                Konfirmasi Penonaktifan
              </ModalHeader>
              <ModalBody>
                Apakah Anda yakin ingin menonaktifkan data ini?
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  onClick={this.deleteSetoran(this.state.hostout_runningid)}
                >
                  {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                  Ya
                </Button>
                {''}

                <Button color="secondary" onClick={this.toggle('delete')}>
                  Tidak
                </Button>
              </ModalFooter>
            </Modal>



            <Modal
            isOpen={this.state.modal_delete_kredit}
            toggle={this.toggle('deleteKredit')}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle('deleteKredit')}>
              Konfirmasi Penonaktifan
            </ModalHeader>
            <ModalBody>
              Apakah Anda yakin ingin menonaktifkan data ini?
            </ModalBody>

            <ModalFooter>
              <Button
                color="primary"
                onClick={this.deleteFinanceKredit(this.state.hostout_runningid)}
              >
                {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
                Ya
              </Button>
              {''}

              <Button color="secondary" onClick={this.toggle('deleteKredit')}>
                Tidak
              </Button>
            </ModalFooter>
          </Modal>


          </CardBody>
        </Card>
      </Page>
    );
  }
}
export default OutletFinancePage;