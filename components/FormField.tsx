import React from 'react'
import { Field,  FieldLabel, } from './ui/field'
import { Input } from './ui/input'
import { Controller, FieldValues ,Control,Path} from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
        control:Control<T>,
        name: Path<T>,
        label?: string,
        placeholder?: string,
        type?: 'email' | 'password' | 'text' | 'file',
}

const FormField = ({control,name,label,placeholder,type}:FormFieldProps<T>) => {
    return (
        <Controller name={name} 
        control={control} 
        render={({ field }) => (

            <Field>
                <FieldLabel className='label'>{label}</FieldLabel>
                <Input 
                className="rounded-full p-5"
                autoComplete="off" 
                placeholder={placeholder}
                type={type}
                {...field}
                 />
                
            </Field>
        )}
        />
  )
}

export default FormField
