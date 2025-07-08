import { createRef } from 'react'
import { renderHook, act } from '@testing-library/react'
import { useInput, type ParseValueHandler, type ValidateValueHandler } from '@/misc'


describe( 'useInput', () => {

	it( 'initializes with default state', () => {

		const { result } = renderHook(() => useInput() )

		expect( result.current.value ).toBeUndefined()
		expect( result.current.isValid ).toBe( true )
		expect( result.current.isEmpty ).toBe( true )
		expect( result.current.hasError ).toBe( false )

	} )


	it( 'initializes with initialValue', () => {

		const { result } = renderHook( () => useInput( { initialValue: 'foo' } ) )

		expect( result.current.value ).toBe( 'foo' )
		expect( result.current.isValid ).toBe( true )
		expect( result.current.isEmpty ).toBe( false )

	} )


	describe( 'changeHandler()', () => {
		
		it( 'calls onChange when value changes', () => {
	
			const onChange = jest.fn()
	
			const { result } = renderHook( () => (
				useInput( { onChange } )
			) )
	
			act( () => {
				result.current.changeHandler( {
					target: { value: 'bar', type: 'text' }
				} as React.ChangeEvent<HTMLInputElement> )
			} )
	
			expect( onChange ).toHaveBeenCalledWith( 'bar' )
	
		} )
		

		it( 'handles checkbox inputs', () => {
	
			const { result } = renderHook( () => useInput() )
	
			act( () => {
				result.current.changeHandler( {
					target: { checked: true, type: 'checkbox' }
				} as React.ChangeEvent<HTMLInputElement> )
			} )
	
			expect( result.current.value ).toBe( true )
	
		} )


		it( 'parses value before calling custom onChange', () => {

			const onChange = jest.fn()

			const implementation: ParseValueHandler<number, number> = (
				value => ( value ? value.toString().length : 0 )
			)
			const parse = jest.fn( implementation )
	
			const { result } = renderHook( () => (
				useInput<number, number>( { parse, onChange, initialValue: 123 } )
			) )

			expect( onChange ).not.toHaveBeenCalled()

			act( () => {
				result.current.changeHandler( {
					target: { value: '12345', type: 'number' }
				} as React.ChangeEvent<HTMLInputElement> )
			} )

			expect( onChange ).toHaveBeenCalledWith( 5 )
			
		} )


		it( 'doesn\'t set isTouched to true if input get erased', () => {
			
			jest.useFakeTimers()

			const { result } = renderHook( () => (
				useInput( { initialValue: 'foo' } )
			) )

			act( () => {
				result.current.changeHandler( {
					target: { value: '', type: 'text' }
				} as React.ChangeEvent<HTMLInputElement> )
			} )

			act( () => {
				jest.runAllTimers()
			} )

			expect( result.current.isTouched ).toBe( false )

			jest.useRealTimers()

		} )

	} )


	describe( 'validate()', () => {
		
		it( 'validates value if validate is provided', () => {
	
			const implementation: ValidateValueHandler<string> = (
				value => value === 'valid'
			)
			const validate = jest.fn( implementation )
	
			const { result } = renderHook( () =>
				useInput( { validate, initialValue: 'invalid' } )
			)
	
			expect( result.current.isValid ).toBe( false )
			expect( result.current.hasError ).toBe( true )
	
		} )
		
	} )

	
	describe( 'parse()', () => {
		
		it( 'parses value if parse is provided', () => {
	
			const implementation: ParseValueHandler<number, number> = (
				value => ( value ? value.toString().length : 0 )
			)
			const parse = jest.fn( implementation )
	
			const { result } = renderHook( () => (
				useInput<number, number>( { parse, initialValue: 123 } )
			) )
	
			expect( result.current.value ).toBe( 3 )
			expect( parse ).toHaveBeenCalledWith( 123 )
	
		} )

	} )
	

	describe( 'setValue()', () => {
		
		it( 'sets the value programmatically', () => {
	
			const { result } = renderHook( () => useInput() )
	
			act( () => {
				result.current.setValue( 'baz' )
			} )
	
			expect( result.current.value ).toBe( 'baz' )
	
		} )

	} )


	describe( 'reset()', () => {
		
		it( 'resets the value', () => {
	
			const { result } = renderHook( () => useInput( { initialValue: 'foo' } ) )
	
			act( () => {
				result.current.setValue( 'bar' )
				result.current.reset()
			} )
	
			expect( result.current.value ).toBe( '' )
	
		} )
		
	} )


	describe( 'blurHandler()', () => {
		
		it( 'sets touched on blur', () => {
	
			const { result } = renderHook( () => useInput( {
				initialValue: '123',
				validate: () => false,
			} ) )
	
			expect( result.current.isTouched ).toBe( false )

			act( () => {
				result.current.blurHandler()
			} )
			
			expect( result.current.isTouched ).toBe( true )
			/**
			 * hasError should be `true` if input is not empty and validation fails after user touched and input.
			 */
			expect( result.current.hasError ).toBe( true )
	
		} )


		it( 'sets the input as untouched on blur if input has no value', () => {
			
			jest.useFakeTimers()
			
			const { result } = renderHook( () => useInput() )

			act( () => {
				result.current.changeHandler( {
					target: { value: 'foo', type: 'text' }
				} as React.ChangeEvent<HTMLInputElement> )
			} )

			act( () => {
				jest.runAllTimers()
			} )

			expect( result.current.isTouched ).toBe( true )

			act( () => {
				result.current.setValue( undefined )
				result.current.blurHandler()
			} )

			expect( result.current.isTouched ).toBe( false )

			jest.useRealTimers()

		} )

	} )


	describe( 'focus()', () => {

		it( 'focuses input if ref is provided', () => {
	
			const focus			= jest.fn()
			const inputRef		= createRef<HTMLInputElement>()
			inputRef.current	= { focus } as unknown as HTMLInputElement
			const { result }	= renderHook( () => (
				useInput( { inputRef } )
			) )
			
			act( () => {
				result.current.focus()
			} )
	
			expect( focus ).toHaveBeenCalled()
	
		} )

	} )
	
	
	describe( 'submit()', () => {

		it( 'trigger validations required to show potential errors when a form is submitted', () => {

			const { result } = renderHook( () => useInput( {
				validate: value => value === 'baz',
			} ) )

			act( () => {
				result.current.setValue( 'foo' )
			} )

			expect( result.current.isTouched ).toBe( false )
			expect( result.current.hasError ).toBe( false )

			act( () => {
				result.current.setValue( 'bar' )
				result.current.submit()
			} )

			expect( result.current.isTouched ).toBe( true )
			/**
			 * hasError should be true since setted value doesn't pass validation function.
			 */
			expect( result.current.hasError ).toBe( true )

		} )

	} )

} )