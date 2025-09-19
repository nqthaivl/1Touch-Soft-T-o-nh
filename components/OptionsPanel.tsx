import React from 'react';
import { SECTIONS_CONFIG } from '../constants';
import type { SelectedOptionsState, OptionGroup, Option } from '../types';

interface OptionsPanelProps {
  selectedOptions: SelectedOptionsState;
  onSelect: (groupId: string, optionId: string, isMultiple: boolean) => void;
  onSelectAll: (groupId: string, optionIds: string[]) => void;
  onDeselectAll: (groupId: string) => void;
}

const CardOption: React.FC<{ option: Option; isSelected: boolean; onClick: () => void }> = ({ option, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
            isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 bg-gray-800 hover:border-amber-400'
        }`}
        role="radio"
        aria-checked={isSelected}
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
        <h4 className="font-semibold text-white">{option.title}</h4>
        <p className="text-sm text-gray-400 mt-1">{option.description}</p>
    </div>
);

const PillOption: React.FC<{ option: Option; isSelected: boolean; onClick: () => void }> = ({ option, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            isSelected ? 'bg-amber-500 text-black' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        }`}
        aria-pressed={isSelected}
    >
        {option.title}
    </button>
);

const PoseOption: React.FC<{ option: Option; isSelected: boolean; onClick: () => void }> = ({ option, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-start gap-4 cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
            isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 bg-gray-800 hover:border-amber-400'
        }`}
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
        <div 
            className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${isSelected ? 'border-amber-500' : 'border-gray-700'}`}
            aria-hidden="true"
        >
            {isSelected && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>}
        </div>
        <div>
            <h4 className="font-semibold text-white">{option.title}</h4>
            <p className="text-sm text-gray-400 mt-1">{option.description}</p>
        </div>
    </div>
);

const OptionGroupComponent: React.FC<{
    group: OptionGroup;
    selection: string | string[] | null;
    onSelect: (groupId: string, optionId: string, isMultiple: boolean) => void;
    onSelectAll: (groupId: string, optionIds: string[]) => void;
    onDeselectAll: (groupId: string) => void;
}> = ({ group, selection, onSelect, onSelectAll, onDeselectAll }) => {
    
    const isAllSelected = Array.isArray(selection) && selection.length > 0 && selection.length === group.options.length;

    const handleSelectAllClick = () => {
        const allOptionIds = group.options.map(opt => opt.id);
        if (isAllSelected) {
            onDeselectAll(group.id);
        } else {
            onSelectAll(group.id, allOptionIds);
        }
    };

    const gridClasses = {
        card: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        pill: 'flex flex-wrap gap-3',
        pose: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4',
    };

    return (
        <div className="mb-8" role="group" aria-labelledby={`${group.id}-title`}>
            <div className="flex justify-between items-center mb-4">
                <h3 id={`${group.id}-title`} className="text-xl font-semibold text-gray-200">{group.title}</h3>
                {group.showSelectAll && (
                    <button onClick={handleSelectAllClick} className="text-amber-500 font-semibold text-sm hover:text-amber-400 transition-colors">
                        {isAllSelected ? 'Bỏ Chọn Tất Cả' : 'CHỌN HẾT'}
                    </button>
                )}
            </div>
            <div className={gridClasses[group.type]}>
                {group.options.map(option => {
                    const isSelected = Array.isArray(selection)
                        ? selection.includes(option.id)
                        : selection === option.id;

                    const handleClick = () => onSelect(group.id, option.id, group.allowMultiple);

                    switch (group.type) {
                        case 'card':
                            return <CardOption key={option.id} option={option} isSelected={isSelected} onClick={handleClick} />;
                        case 'pill':
                            return <PillOption key={option.id} option={option} isSelected={isSelected} onClick={handleClick} />;
                        case 'pose':
                            return <PoseOption key={option.id} option={option} isSelected={isSelected} onClick={handleClick} />;
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
};

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ selectedOptions, onSelect, onSelectAll, onDeselectAll }) => {
    return (
        <aside className="w-full lg:w-1/2 p-6 md:p-10 bg-[#1C1C1C] overflow-y-auto" aria-label="Styling Options">
            {SECTIONS_CONFIG.map(section => (
                <section key={section.id} className="mb-10" aria-labelledby={`${section.id}-title`}>
                    <h2 id={`${section.id}-title`} className="text-2xl font-bold text-white mb-2">{section.title}</h2>
                    {section.description && <p className="text-gray-400 mb-6">{section.description}</p>}

                    {section.groups.map(group => (
                        <OptionGroupComponent
                            key={group.id}
                            group={group}
                            selection={selectedOptions[group.id]}
                            onSelect={onSelect}
                            onSelectAll={onSelectAll}
                            onDeselectAll={onDeselectAll}
                        />
                    ))}
                </section>
            ))}
        </aside>
    );
};
