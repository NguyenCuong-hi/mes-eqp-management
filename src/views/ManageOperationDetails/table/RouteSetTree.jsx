import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid';
import {
  CarryOutOutlined,
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  LoadingOutlined,
  SearchOutlined,
  TableOutlined
} from '@ant-design/icons';
import { useLayer } from 'react-laag';
// import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
// import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message, Pagination, Tree, Input } from 'antd';

// import ModalHelpRootMenu from '../../modal/system/modalHelpRootMenu'
// import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import { useExtraCells } from '@glideapps/glide-data-grid-cells';
// import { AsyncDropdownCellRenderer } from '../../sheet/cells/AsyncDropdownCellRenderer'
// import LayoutStatusMenuSheetNew from '../../sheet/jsx/layoutStatusMenuNew'
import dayjs from 'dayjs';
import useOnFill from 'utils/hooks/onFillHook';
import { loadFromLocalStorageSheet } from 'utils/local-storage/column';
import { resetColumn } from 'utils/local-storage/reset-column';
import ContextMenuWrapper from 'component/ContextMenu';
import { DeleteOutline, EditOffRounded } from '@mui/icons-material';
import { AsyncDropdownCellRenderer } from 'utils/sheets/cell-custom/AsyncDropdownCellRenderer';
import { StepsCell } from 'utils/sheets/cell-custom/cellsOperationsSteps';


function RouteSetTree({ routeTree, setRouteTree,  onSelect, onTreeClicked, keyword, setKeyword, onSearch, onKeyDown }) {
  const [showLine, setShowLine] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [showLeafIcon, setShowLeafIcon] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const handleLeafIconChange = (value) => {
    if (value === 'custom') {
      return setShowLeafIcon(<CheckOutlined />);
    }
    if (value === 'true') {
      return setShowLeafIcon(true);
    }
    return setShowLeafIcon(false);
  };
  return (
    <div className="w-full h-full bg-white  overflow-x-hidden overflow-hidden  ">
      <div className="w-full h-[30px] flex items-center px-2 border-b border-gray-200 ">
        <div className="w-full flex gap-2">
          {isLoading ? <LoadingOutlined className="animate-spin" /> : <SearchOutlined />}
          <input
            value={keyword}
            onChange={onSearch}
            onKeyDown={onKeyDown}
            highlight={true}
            autoFocus={true}
            className="h-full w-full border-none focus:outline-none hover:border-none bg-inherit"
          />
        </div>
      </div>
      <Tree showLine={true} showIcon={true} defaultExpandedKeys={['0-0-0']} onSelect={onSelect} treeData={routeTree} />
    </div>
  );
}

export default RouteSetTree;
