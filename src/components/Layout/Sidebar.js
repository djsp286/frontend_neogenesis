import logo200Image from 'assets/img/logo/logo_200.png';
import sidebarBgImage from 'assets/img/sidebar/sidebar-0.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
import {
  MdAccountCircle,
  MdArrowDropDownCircle,
  MdBorderAll,
  MdBrush,
  MdChromeReaderMode,
  MdDashboard,
  MdExtension,
  MdFormatListBulleted,
  MdGroupWork,
  MdInsertChart,
  MdKeyboardArrowDown,
  MdNotificationsActive,
  MdPages,
  MdRadioButtonChecked,
  MdSend,
  MdStar,
  MdTextFields,
  MdViewCarousel,
  MdViewDay,
  MdViewList,
  MdWeb,
  MdWidgets,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavItem, NavLink as BSNavLink } from 'reactstrap';
import bn from 'utils/bemnames';

var accessList = { "191": [191] };

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const navMasterTest = [
  { to: '/mastertest', id: '191', name: 'master test', exact: false, Icon: MdRadioButtonChecked },
];

const navMasterDataA = [
  { to: '/dosageform', id: '191', name: 'dosage form', exact: false, Icon: MdRadioButtonChecked },
  { to: '/generik', id: '191', name: 'generik', exact: false, Icon: MdRadioButtonChecked },
  { to: '/klasifikasi-bpom', id: '191', name: 'klasifikasi bpom', exact: false, Icon: MdRadioButtonChecked },
  { to: '/strength', id: '191', name: 'strength', exact: false, Icon: MdRadioButtonChecked },
];

const navMasterDataB = [
  { to: '/departemen-produk', id: '191', name: 'departemen produk', exact: false, Icon: MdRadioButtonChecked },
  { to: '/dimensi', id: '341', name: 'dimensi', exact: false, Icon: MdRadioButtonChecked },
  // { to: '/karakteristik', name: 'karakteristik produk', exact: false, Icon: MdRadioButtonChecked },
  { to: '/kemasan', id: '197', name: 'kemasan', exact: false, Icon: MdRadioButtonChecked },
  { to: '/puredead', id: '240', name: 'puredead produk', exact: false, Icon: MdRadioButtonChecked },
  { to: '/unit', id: '266', name: 'unit', exact: false, Icon: MdRadioButtonChecked },
];

const navMasterDataC = [
  { to: '/confirm-schedule-hja', id: '191', name: 'confirm schedule hja', exact: false, Icon: MdRadioButtonChecked },
  { to: '/point', id: '191', name: 'point', exact: false, Icon: MdRadioButtonChecked },
  { to: '/produk', id: '191', name: 'produk', exact: false, Icon: MdRadioButtonChecked },
];

const navMasterDataD = [
  { to: '/brand', id: '191', name: 'brand', exact: false, Icon: MdRadioButtonChecked },
  { to: '/gimmick', id: '191', name: 'gimmick', exact: false, Icon: MdRadioButtonChecked },
  { to: '/principal', id: '191', name: 'principal', exact: false, Icon: MdRadioButtonChecked },
  { to: '/supplier', id: '191', name: 'supplier', exact: false, Icon: MdRadioButtonChecked }
];

const navPurchaseOrder= [
  { to: '/purchase_order', id: '191', name: 'purchase_order', exact: false, Icon: MdRadioButtonChecked },
]

const navMasterDataE = [
  { to: '/bridging-supplier-kota', id: '191', name: 'bridging supplier kota', exact: false, Icon: MdRadioButtonChecked },
  { to: '/copy-temp-beli-lokal', id: '191', name: 'copy template pembelian lokal', exact: false, Icon: MdRadioButtonChecked },
  { to: '/pembelian-lokal', id: '191', name: 'pembelian lokal', exact: false, Icon: MdRadioButtonChecked },
];

const navMasterDataF = [
  { to: '/product-counter', id: '191', name: 'product counter', exact: false, Icon: MdRadioButtonChecked }, //comment
];

const navMasterDataG = [
  { to: '/alasan', id: '191', name: 'alasan', exact: false, Icon: MdRadioButtonChecked },
  { to: '/biaya-ekspedisi', id: '191', name: 'biaya ekspedisi', exact: false, Icon: MdRadioButtonChecked },
  { to: '/ekspedisi', id: '191', name: 'ekspedisi', exact: false, Icon: MdRadioButtonChecked },
  { to: '/minimal-sp', id: '191', name: 'minimal sp', exact: false, Icon: MdRadioButtonChecked },
  { to: '/mobil', id: '191', name: 'mobil', exact: false, Icon: MdRadioButtonChecked },
  { to: '/titipan-luar-kota', id: '191', name: 'titipan luar kota', exact: false, Icon: MdRadioButtonChecked },
];

const navMasterDataH = [
  { to: '/outlet', id: '191', name: 'outlet', exact: false, Icon: MdRadioButtonChecked }, //MdStore
  { to: '/outletschedule', id: '191', name: 'schedule', exact: false, Icon: MdRadioButtonChecked }, //MdSchedule
  { to: '/outletdatacamera', id: '191', name: 'data camera', exact: false, Icon: MdRadioButtonChecked }, //MdPhotoCamera
  { to: '/outletdataapotik', id: '191', name: 'data apotik', exact: false, Icon: MdRadioButtonChecked }, //MdFolderOpen
  { to: '/outletbusdev', id: '191', name: 'busdev', exact: false, Icon: MdRadioButtonChecked }, //MdPayment
  { to: '/outletaccountingpajak', id: '191', name: 'accounting - pajak', exact: false, Icon: MdRadioButtonChecked }, //MdAttachMoney
  { to: '/outletaccountingsupplier', id: '191', name: 'accounting - supplier', exact: false, Icon: MdRadioButtonChecked }, //MdAttachMoney
  { to: '/outletfinance', id: '191', name: 'finance', exact: false, Icon: MdRadioButtonChecked }, //MdAttachMoney
  { to: '/group-pemilik-lokasi', id: '191', name: 'Group Pemilik Lokasi', exact: false, Icon: MdRadioButtonChecked }, //MdAccountCircle
  { to: '/jenis-area', id: '191', name: 'jenis area', exact: false, Icon: MdRadioButtonChecked }, //MdLocationOn
  { to: '/shift-outlet', id: '191', name: 'shift outlet', exact: false, Icon: MdRadioButtonChecked },//MdSchedule
  { to: '/jenis-outlet', id: '191', name: 'jenis outlet', exact: false, Icon: MdRadioButtonChecked }, //MdStore
];

const navMasterDataI = [
  { to: '/solusi', id: '191', name: 'solusi (mc)', exact: false, Icon: MdRadioButtonChecked },
  { to: '/diagnosa', id: '191', name: 'diagnosa (gc)', exact: false, Icon: MdRadioButtonChecked },
  { to: '/kategori-print', id: '191', name: 'kategori print (sgc)', exact: false, Icon: MdRadioButtonChecked },
  // { to: '/tc-penyakit', name: 'tc penyakit', exact: false, Icon: "none" }, //MdSchedule
  { to: '/bridging-sick', id: '191', name: 'bridging sick', exact: false, Icon: MdRadioButtonChecked }, //comment
  { to: '/pic-tc-print', id: '191', name: 'pic tc print', exact: false, Icon: MdRadioButtonChecked }, //comment
];

const navMasterDataJ = [
  { to: '/template-alokasi-outlet', id: '191', name: 'template alokasi outlet', exact: false, Icon: MdRadioButtonChecked },
];

const navComponents = [
  { to: '/buttons', id: '191', name: 'buttons', exact: false, Icon: MdRadioButtonChecked },
  { to: '/button-groups', id: '191', name: 'button groups', exact: false, Icon: MdGroupWork },
  { to: '/forms', id: '191', name: 'forms', exact: false, Icon: MdChromeReaderMode },
  { to: '/input-groups', id: '191', name: 'input groups', exact: false, Icon: MdViewList },
  { to: '/dropdowns', id: '191', name: 'dropdowns', exact: false, Icon: MdArrowDropDownCircle },
  { to: '/badges', id: '191', name: 'badges', exact: false, Icon: MdStar },
  { to: '/alerts', id: '191', name: 'alerts', exact: false, Icon: MdNotificationsActive },
  { to: '/progress', id: '191', name: 'progress', exact: false, Icon: MdBrush },
  { to: '/modals', id: '191', name: 'modals', exact: false, Icon: MdViewDay },
];

const navContents = [
  { to: '/typography', id: '191', name: 'typography', exact: false, Icon: MdTextFields },
  { to: '/tables', id: '191', name: 'tables', exact: false, Icon: MdBorderAll },
];

const pageContents = [
  { to: '/login', id: '191', name: 'login / signup', exact: false, Icon: MdAccountCircle },
  { to: '/login-modal', id: '191', name: 'login modal', exact: false, Icon: MdViewCarousel },
];

const navItems = [
  { to: '/', id: '191', name: 'dashboard', exact: true, Icon: MdDashboard },
];

const navItems2 = [
  { to: '/cards', id: '191', name: 'cards', exact: false, Icon: MdWeb },
  { to: '/charts', id: '191', name: 'charts', exact: false, Icon: MdInsertChart },
  { to: '/widgets', id: '191', name: 'widgets', exact: false, Icon: MdWidgets },
];

const navMaster_PO = [
  { to: '/poOutStanding', id: '191', name: 'PO Outstanding', exact: false, Icon: MdRadioButtonChecked },
];


const bem = bn.create('sidebar');

class Sidebar extends React.Component {

  constructor(props) {
    super(props)
    console.log(accessList);
    console.log(window.localStorage.getItem('accessList'));

    if (window.localStorage.getItem('accessList')) {
      accessList = JSON.parse(window.localStorage.getItem('accessList'));
    } else {
    }
  }
  state = {
    isOpenMasterPO : false
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };


  //added by Master I team at 11/10/2019
  refreshSamePage = (currPath, toPath) => () => {
    var temporary = "http://localhost:3000" + toPath;
    console.log(currPath + " " + temporary);
    if (currPath === temporary) {
      window.location.reload(false);
    }
  }

  allFound = (master) => {
    return master.some(menu => Object.keys(accessList).includes(menu.id));
  }


  render() {

    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className="navbar-brand d-flex">
              <img
                src={logo200Image}
                width="40"
                height="30"
                className="pr-2"
                alt=""
              />
              <span className="text-white">
                Neo Genesis
              </span>
            </SourceLink>
          </Navbar>

          <Nav vertical>
            {navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}


              {/*Master_PO*/}
            {this.allFound(navMaster_PO) && <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('Master_PO')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdFormatListBulleted className={bem.e('nav-item-icon')} />
                  <span className="">Master PO</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenMaster_PO
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>}
            {this.allFound(navMaster_PO) && <Collapse isOpen={this.state.isOpenMaster_PO}>
              {navMaster_PO.map(({ to, id, name, exact, Icon }, index) => (
                Object.keys(accessList).includes(id) &&
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>}
            
            
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;